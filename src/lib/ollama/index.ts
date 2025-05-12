import { TAIMessage, TOllamaChatResponse, TOllamaEmbeddingResponse, TOllamaFunctionSpec } from "@/types";

type TChatCompletionParams = {
  model: string;
  messages: TAIMessage[];
  temperature?: number;
  tools?: TOllamaFunctionSpec[];
  tool_choice?: string;
  parallel_tool_calls?: boolean;
};

class Ollama {
  private readonly baseURL: string;
  private readonly apiKey?: string;

  constructor(input: { baseURL: string; apiKey?: string }) {
    this.baseURL = input.baseURL;
    this.apiKey = input.apiKey;
  }

  public embeddings = {
    create: async (opts: { model: string; input: string | string[] }): Promise<TOllamaEmbeddingResponse> => {
      const url = `${this.baseURL}/v1/embeddings`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : undefined),
        },
        body: JSON.stringify({ model: opts.model, input: opts.input }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Ollama embedding error (${res.status}): ${text}`);
      }

      const data: TOllamaEmbeddingResponse = await res.json();

      return data;
    },
  };

  public chat = {
    completions: {
      /**
       * Create a chat completion via Ollama
       */
      create: async (opts: TChatCompletionParams): Promise<TOllamaChatResponse> => {
        const { model, messages, temperature = 0.1, tools = [], tool_choice = "auto", parallel_tool_calls = false } = opts;

        const url = `${this.baseURL}/v1/chat/completions`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : undefined),
          },
          body: JSON.stringify({
            model,
            messages,
            temperature,
            tools,
            tool_choice,
            parallel_tool_calls,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Ollama chat error (${res.status}): ${text}`);
        }

        const data: TOllamaChatResponse = await res.json();

        return data;
      },
    },
  };
}

type TOllama = Ollama;

export { Ollama };
export type { TOllama };
