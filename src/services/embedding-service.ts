import "dotenv/config";

import { Ollama, TOllama } from "@/lib/ollama";
import crypto from "crypto";

const OLLAMA_SERVER_BASE_URL = String(process.env.OLLAMA_SERVER_BASE_URL);
const OLLAMA_EMBEDDING_MODEL = String(process.env.OLLAMA_EMBEDDING_MODEL);
const OLLAMA_API_KEY = String(process.env.OLLAMA_API_KEY);
const VECTOR_DIMENSIONS = Number(process.env.VECTOR_DIMENSIONS);

if (!OLLAMA_SERVER_BASE_URL || !OLLAMA_EMBEDDING_MODEL || !OLLAMA_API_KEY || !VECTOR_DIMENSIONS) {
  throw new Error("OLLAMA_SERVER_BASE_URL, OLLAMA_EMBEDDING_MODEL, OLLAMA_API_KEY, and VECTOR_DIMENSIONS must be set");
}

interface IEmbeddingService {
  generate(text: string): Promise<{ embedding: number[]; contentHash: string }>;
}

class EmbeddingService implements IEmbeddingService {
  private readonly _llm: TOllama;

  constructor() {
    this._llm = new Ollama({ baseURL: `${OLLAMA_SERVER_BASE_URL}` });
  }

  /**
   * Generate an embedding for the given text
   */
  async generate(text: string): Promise<{ embedding: number[]; contentHash: string }> {
    const embeddingResponse = await this._llm.embeddings.create({
      model: OLLAMA_EMBEDDING_MODEL,
      input: text,
    });

    const contentHash = await this._generateHash(text);
    const embedding = embeddingResponse.data[0].embedding;

    return { embedding, contentHash };
  }

  // Private methods
  /**
   * Generate a SHA-256 content hash for deduplication
   */
  private async _generateHash(text: string): Promise<string> {
    return crypto.createHash("sha256").update(text).digest("hex");
  }
}

const embeddingService = new EmbeddingService();
type TEmbeddingService = typeof embeddingService;

export { embeddingService };
export type { TEmbeddingService };
