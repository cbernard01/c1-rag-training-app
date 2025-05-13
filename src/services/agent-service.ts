import { TAIMessage } from "@/types";
import { embeddingService, TEmbeddingService } from "./embedding-service";
import { llmService, TLLMService } from "./llm-service";
import { memoryService, TMemoryService } from "./memory-service";
import { toolsService, TToolsService } from "./tool-service";
import { TVectorService, vectorService } from "./vector-service";

const VECTOR_COLLECTION = String(process.env.VECTOR_COLLECTION);

if (!VECTOR_COLLECTION) {
  throw new Error("VECTOR_COLLECTION must be set");
}

interface IAgentService {
  execute(userMessage: string): Promise<TAIMessage>;
}

class AgentService implements IAgentService {
  private readonly _memorySvc: TMemoryService;
  private readonly _llmSvc: TLLMService;
  private readonly _embeddingSvc: TEmbeddingService;
  private readonly _vectorSvc: TVectorService;
  private readonly _toolsSvc: TToolsService;

  constructor() {
    this._memorySvc = memoryService;
    this._llmSvc = llmService;
    this._embeddingSvc = embeddingService;
    this._vectorSvc = vectorService;
    this._toolsSvc = toolsService;
  }

  // Public methods

  async execute(userMessage: string): Promise<TAIMessage> {
    // 1. create a new message object
    const message: TAIMessage = { role: "user", content: userMessage };

    await this._memorySvc.add(message);

    const messages = await this._memorySvc.getAll();

    // 4. get all tools
    const tools = await this._toolsSvc.getAll();

    const response = await this._llmSvc.execute({ messages, tools });

    await this._memorySvc.add(response);

    // 9. execute any tool calls
    const toolResult = await this._executeTool(response, userMessage);

    // 10. save the tool call to memory
    if (toolResult) {
      response.content = toolResult;
      await this._memorySvc.add({ role: "assistant", content: toolResult });
    }

    // 2. Return the message
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
