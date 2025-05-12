import "dotenv/config";

import { TVectorCreateParams, TVectorFilter, TVectorMetadata, TVectorQuery, TVectorResponse, TVectorResult, TVectorSearchScoredPoint } from "@/types";
import { QdrantClient } from "@qdrant/js-client-rest";
import { v4 as uuidv4 } from "uuid";

const VECTOR_DATABASE_URL = String(process.env.VECTOR_DATABASE_URL);
const VECTOR_DIMENSIONS = Number(process.env.VECTOR_DIMENSIONS);
const VECTOR_DISTANCE = String(process.env.VECTOR_DISTANCE) as "Cosine" | "Euclid" | "Dot" | "Manhattan";

if (!VECTOR_DATABASE_URL || !VECTOR_DIMENSIONS || !VECTOR_DISTANCE) {
  throw new Error("VECTOR_DATABASE_URL, VECTOR_DIMENSIONS, and VECTOR_DISTANCE must be set");
}

export interface IVectorService {
  /**
   * Upsert a point: you pass in your content + any metadata
   */
  create(params: TVectorCreateParams & { metadata?: TVectorMetadata }): Promise<void>;

  /**
   * Search for nearest neighbors in the collection.
   * You can pass either:
   *  - `filter` (simple AND / must) OR
   *  - `rawFilter` (entire Qdrant filter, e.g. a `should`/OR clause).
   */
  find(params: TVectorQuery): Promise<TVectorResponse>;
}

export class VectorService implements IVectorService {
  private readonly _db: QdrantClient;
  private readonly _knownCollections: Set<string>;

  constructor() {
    this._db = new QdrantClient({ url: VECTOR_DATABASE_URL });
    this._knownCollections = new Set<string>();
  }

  async create(params: TVectorCreateParams): Promise<void> {
    const { collection, vector, payload } = params;

    try {
      // Ensure the collection exists
      await this._ensureCollectionExists(collection);
    } catch (err) {
      console.error("Error creating collection:", err);
      throw new Error("Failed to create collection in Qdrant");
    }

    // Generate a unique ID for the point
    const id = this._generateId();

    // Check if the contentHash already exists
    const existingPoints = await this._findByContentHash({ collection, contentHash: payload.contentHash, vector });
    if (existingPoints.length > 0) return;

    try {
      // Flatten metadata into the top-level payload
      await this._db.upsert(collection, { points: [{ id, vector, payload: { ...payload } }], wait: true });
    } catch (err) {
      console.error("Error upserting vector:", err);
      throw new Error("Failed to add vector to Qdrant");
    }
  }

  async find(params: TVectorQuery): Promise<TVectorResponse> {
    const { collection, vector, topK = 5, filter } = params;

    try {
      // Ensure the collection exists
      await this._ensureCollectionExists(collection);

      // Search for the nearest neighbors
      const rawHits = await this._db.search(collection, {
        vector,
        limit: topK,
        filter,
        with_payload: true,
        with_vector: true,
      });

      // Map the raw hits to the expected format
      const results: TVectorResult[] = rawHits.map(hit => ({
        collection,
        id: String(hit.id),
        score: hit.score!,
        payload: hit.payload as TVectorResult["payload"],
        vector: hit.vector as TVectorResult["vector"],
      }));

      return { collection, results, totalCount: results.length };
    } catch (err) {
      console.error("Error searching vectors:", err);
      throw new Error("Failed to retrieve vectors from Qdrant");
    }
  }

  // Private methods

  private _generateId() {
    return uuidv4();
  }

  private async _ensureCollectionExists(collection: string): Promise<void> {
    // If we already know about this collection, skip the check
    if (this._knownCollections.has(collection)) return;

    // Check if the collection exists
    const { exists } = await this._db.collectionExists(collection);

    // If the collection doesn't exist, create it
    if (!exists) await this._db.createCollection(collection, { vectors: { size: VECTOR_DIMENSIONS, distance: VECTOR_DISTANCE } });

    // Add the collection to our list of known collections
    this._knownCollections.add(collection);
  }

  private _findByContentHash(params: { collection: string; contentHash: string; vector: number[] }): Promise<TVectorSearchScoredPoint[]> {
    const { collection, contentHash, vector } = params;

    return this._db.search(collection, {
      vector,
      limit: 1,
      with_payload: true,
      with_vector: true,
      filter: { must: [{ key: "contentHash", match: { value: contentHash } }] },
    });
  }

  private _buildConditions(params: TVectorFilter) {
    return Object.entries(params)
      .filter(([, v]) => v != null)
      .map(([key, value]) => ({
        key,
        match: { value },
      }));
  }
}

export const vectorService = new VectorService();
export type TVectorService = typeof vectorService;
