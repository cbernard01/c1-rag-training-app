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

    // 2. Return the message
    return message;
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
