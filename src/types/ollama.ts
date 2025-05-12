import { TAIMessage } from "@/types";

export type TOllamaEmbedding = {
  object: "embedding";
  embedding: number[];
  index: number;
};

export type TOllamaEmbeddingResponse = {
  object: "list";
  data: TOllamaEmbedding[];
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
};

export type TOllamaChatChoice = {
  index: number;
  message: TAIMessage;
};

export type TOllamaChatResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: TOllamaChatChoice[];
};

export type TOllamaConfig = {
  baseURL: string;
  apiKey?: string;
};
