import { TAIMessage } from "@/types";
import { llmService, TLLMService } from "./llm-service";
import { memoryService, TMemoryService } from "./memory-service";
import { toolsService, TToolsService } from "./tool-service";
import { TVectorService, vectorService } from "./vector-service";

interface IAgentService {
  execute(userMessage: string): Promise<TAIMessage>;
}

class AgentService implements IAgentService {
  private readonly _memorySvc: TMemoryService;
  private readonly _llmSvc: TLLMService;
  private readonly _vectorSvc: TVectorService;
  private readonly _toolsSvc: TToolsService;

  constructor() {
    this._memorySvc = memoryService;
    this._llmSvc = llmService;
    this._vectorSvc = vectorService;
    this._toolsSvc = toolsService;
  }

  // Public methods

  async execute(userMessage: string): Promise<TAIMessage> {
    // 1. Add user message to memory
    await this._memorySvc.add({ role: "user", content: userMessage });

    // 2. Get all messages from memory
    const messages = await this._memorySvc.getAll();

    // 3. Get all tools from tools service
    const tools = await this._toolsSvc.getAll();

    // 4. Execute the LLM
    const response = await this._llmSvc.execute({ messages, tools });

    // 5. Add the response to memory
    await this._memorySvc.add(response);

    // 6. If the response is an assistant message and has tool calls, execute the tool
    const toolResult = await this._executeTool(response, userMessage);

    // 7. If the tool result is not null, update the response content
    if (toolResult) response.content = toolResult;

    // 8. Return the response
    return response;
  }

  // Private methods
  private async _executeTool(response: TAIMessage, userMessage: string): Promise<string | null> {
    if (response.role === "assistant" && response.tool_calls) {
      return await this._toolsSvc.execute({ toolCall: response.tool_calls[0], message: userMessage });
    }

    return null;
  }
}

const agentService = new AgentService();
type TAgentService = typeof agentService;

export { agentService };
export type { TAgentService };
