import { TAIMessage, TTool } from "@/types";
import { OpenAI } from "openai";
import { zodFunction } from "openai/helpers/zod";

type TMessageParams = {
  tools?: TTool[];
  messages: TAIMessage[];
};

interface ILLMService {
  execute(params: TMessageParams): Promise<TAIMessage>;
}

class LLMService implements ILLMService {
  private readonly _llm: OpenAI;

  constructor() {
    this._llm = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async execute({ messages, tools = [] }: TMessageParams): Promise<TAIMessage> {
    const formattedTools = tools.map(zodFunction);

    const response = await this._llm.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      messages,
      tools: formattedTools,
      tool_choice: "auto",
      parallel_tool_calls: false,
    });

    return response.choices[0].message;
  }
}

const llmService = new LLMService();

type TLLMService = typeof llmService;

export { llmService };
export type { TLLMService };
