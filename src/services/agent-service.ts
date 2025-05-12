import { systemPrompts } from "@/lib/prompts";
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

    // 2. Add user message to memory
    await this._memorySvc.add(message);

    // 3. Get all messages from memory
    // const messages = await this._memorySvc.getAll();

    // 3. Embed the user message
    const { embedding } = await this._embeddingSvc.generate(userMessage);

    // 4. find nearest neighbors
    const { results, totalCount } = await this._vectorSvc.find({ collection: VECTOR_COLLECTION, vector: embedding, topK: 10 });

    // 5.. Get the most relevant messages
    const contextMessages: TAIMessage[] = results.map(hit => ({
      role: "assistant",
      content: `VECTOR_CONTEXT: Related note (score=${hit.score.toFixed(3)}): ${hit.payload.content}`,
    }));

    console.log("\n--- Vector Context Messages ---");
    console.log(JSON.stringify(contextMessages, null, 2));

    console.log(`Vector messages: ${totalCount}`);
    console.log(`Total messages sent to LLM: ${contextMessages.length + 1}`);

    const allMessages: TAIMessage[] = [systemPrompts.default, ...contextMessages, message];

    console.log("\n--- All Messages ---");
    console.log(JSON.stringify(allMessages, null, 2));

    // 6. Execute the LLM
    const response = await this._llmSvc.execute({ messages: allMessages });

    // 7. Add the response to memory
    await this._memorySvc.add(response);

    // 8. If the response is an assistant message and has tool calls, execute the tool
    const toolResult = await this._executeTool(response, userMessage);

    // 9. If the tool result is not null, update the response content
    if (toolResult) response.content = toolResult;

    // 10. Return the response
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
