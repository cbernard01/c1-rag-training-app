import { TAIMessage } from "@/types";
import { OpenAI } from "openai";

type TMessageParams = {
  messages: TAIMessage[];
};

class LLMService {
  private readonly _llm: OpenAI;

  constructor() {
    this._llm = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async run({ messages }: TMessageParams): Promise<TAIMessage> {
    const response = await this._llm.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      messages,
    });

    return {
      role: "assistant",
      content: response.choices[0].message.content || "",
    };
  }
}

const llmService = new LLMService();

type TLLMService = typeof llmService;

export { llmService };
export type { TLLMService };
