import { Ollama, TOllama } from "@/lib/ollama";
import { TAIMessage, TTool } from "@/types";

const OLLAMA_SERVER_BASE_URL = String(process.env.OLLAMA_SERVER_BASE_URL);
const OLLAMA_LLM_MODEL = String(process.env.OLLAMA_LLM_MODEL);

if (!OLLAMA_SERVER_BASE_URL || !OLLAMA_LLM_MODEL) {
  throw new Error("OLLAMA_SERVER_BASE_URL or OLLAMA_LLM_MODEL is not set");
}

type TMessageParams = {
  tools?: TTool[];
  messages: TAIMessage[];
};

interface ILLMService {
  execute(params: TMessageParams): Promise<TAIMessage>;
}

class LLMService implements ILLMService {
  private readonly _llm: TOllama;

  constructor() {
    this._llm = new Ollama({ baseURL: `${OLLAMA_SERVER_BASE_URL}` });
  }

  async execute({ messages }: TMessageParams): Promise<TAIMessage> {
    const response = await this._llm.chat.completions.create({
      model: OLLAMA_LLM_MODEL,
      temperature: 0.1,
      messages,
      tools: [],
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
