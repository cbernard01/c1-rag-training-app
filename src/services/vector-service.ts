import { TMovieMetadata, TQueryParams } from "@/types";
import { QueryResult, Index as UpstashIndex } from "@upstash/vector";

// Get the environment variables
const UPSTASH_VECTOR_REST_URL = String(process.env.UPSTASH_VECTOR_REST_URL);
const UPSTASH_VECTOR_REST_TOKEN = String(process.env.UPSTASH_VECTOR_REST_TOKEN);

if (!UPSTASH_VECTOR_REST_URL || !UPSTASH_VECTOR_REST_TOKEN) {
  throw new Error("UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN must be set");
}

class VectorService {
  private readonly _db: UpstashIndex;

  constructor() {
    this._db = new UpstashIndex({
      url: UPSTASH_VECTOR_REST_URL,
      token: UPSTASH_VECTOR_REST_TOKEN,
    });
  }

  // Public methods

  async find({ query, topK = 5, filter }: TQueryParams): Promise<QueryResult[]> {
    let filterStr: string | undefined = undefined;

    if (filter) filterStr = this._buildFilters(filter);

    const results = await this._db.query({
      data: query,
      topK: topK,
      filter: filterStr,
      includeMetadata: true,
      includeData: true,
    });

    return results;
  }

  // Private methods

  private _buildFilters(params: TMovieMetadata): string {
    const filterParts = Object.entries(params).filter(([, value]) => value !== undefined);
    const filters = filterParts.map(([key, value]) => `${key}='${value}'`);

    return filters.join(" AND ");
  }
}

const vectorService = new VectorService();

type TVectorService = typeof vectorService;

export { vectorService };
export type { TVectorService };
