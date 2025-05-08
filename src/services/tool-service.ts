import { getWeatherTool, movieSearchTool } from "@/lib/tools";
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

  constructor() {
    this._memorySvc = memoryService;
  }

  async getAll(): Promise<TTool[]> {
    return [getWeatherTool as TTool, movieSearchTool as TTool];
  }

  async execute({ toolCall, message }: TToolParams): Promise<string> {
    const input = { message, toolArgs: JSON.parse(toolCall.function.arguments || "{}") };

    let result: string;

    switch (toolCall.function.name) {
      case getWeatherTool.name:
        result = await getWeatherTool.function(input);
        break;
      case movieSearchTool.name:
        result = await movieSearchTool.function(input);
        break;
      default:
        throw new Error(`Tool ${toolCall.function.name} not found`);
    }

    await this._memorySvc.addToolCallResponse(toolCall.id, result);

    return result;
  }
}

const toolsService = new ToolsService();
type TToolsService = typeof toolsService;

export { toolsService };
export type { TToolsService };
