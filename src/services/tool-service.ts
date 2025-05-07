class ToolsService {
  constructor() {}
}

const toolsService = new ToolsService();

type TToolsService = typeof toolsService;

export { toolsService };
export type { TToolsService };
