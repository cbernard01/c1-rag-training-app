import { Schemas } from "@qdrant/js-client-rest";

export type TVector = number[];

export type TVectorFilter = Schemas["Filter"];
export type TVectorSearchScoredPoint = Schemas["ScoredPoint"];

export type TVectorMetadata = Record<string, string | number | boolean | null | undefined>;

export type TVectorPayload = {
  content: string;
  contentHash: string;
  metadata: TVectorMetadata;
};

export type TVectorCreateParams = {
  collection: string;
  vector: TVector;
  payload: TVectorPayload;
};

export interface TVectorQuery {
  collection: string;
  vector: TVector;
  topK?: number;
  filter?: TVectorFilter;
}

export interface TVectorResult {
  collection: string;
  id: string;
  score: number;
  payload: TVectorPayload;
  vector: TVector;
}

export interface TVectorResponse {
  collection: string;
  results: TVectorResult[];
  totalCount: number;
}

export type TVectorSearchParams = {
  collection: string;
  accountNumber: string;
  vector: TVector;
  topK?: number;
  filter?: TVectorFilter;
};
