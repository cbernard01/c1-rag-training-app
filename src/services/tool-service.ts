import { echoTextTool, getWeatherTool, movieSearchTool, reverseTextTool } from "@/lib/tools";
import { TTool, TToolCall } from "@/types";
import { memoryService, TMemoryService } from "./memory-service";

type TToolParams = {
  toolCall: TToolCall;
  message: string;
};

interface IToolsService {
  getAll(): Promise<TTool[]>;
  execute(params: TToolParams): Promise<string>;
}

class ToolsService implements IToolsService {
  private readonly _memorySvc: TMemoryService;
  private readonly _tools: TTool[];

  constructor() {
    this._memorySvc = memoryService;
    this._tools = [getWeatherTool, movieSearchTool, echoTextTool, reverseTextTool] as TTool[];
  }

  async getAll(): Promise<TTool[]> {
    return this._tools;
  }

  async execute({ toolCall }: TToolParams): Promise<string> {
    const tool = this._tools.find(t => t.name === toolCall.function.name);

    if (!tool) {
      throw new Error(`Tool ${toolCall.function.name} not found`);
    }

    // Parse the tool arguments
    const args = JSON.parse(toolCall.function.arguments || "{}");
    const result = await tool.execute(args);

    // Save the response in memory
    await this._memorySvc.addToolCallResponse(toolCall.id, result);

    return result;
  }
}

const toolsService = new ToolsService();
type TToolsService = typeof toolsService;

export { toolsService };
export type { TToolsService };
