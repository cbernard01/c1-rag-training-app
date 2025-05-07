import { OpenAI } from "openai";

export type TMovie = {
  id: string;
  releaseDate: string;
  title: string;
  overview: string;
  popularity: number;
  voteCount: number;
  voteAverage: number;
  originalLanguage: string;
  genre: string;
  posterUrl: string;
};

export type TMovieMetadata = {
  releaseDate?: string;
  title?: string;
  overview?: string;
  popularity?: number;
  voteCount?: number;
  voteAverage?: number;
  originalLanguage?: string;
  genre?: string;
  posterUrl?: string;
};

export type TQueryParams = {
  query: string;
  topK: number;
  filter?: TMovieMetadata;
};

export type TAIMessage = OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam | { role: "user"; content: string } | { role: "tool"; content: string; tool_call_id: string };

export interface ToolFn<A = unknown, T = unknown> {
  (input: { userMessage: string; toolArgs: A }): Promise<T>;
}

export type TMessageWithMetadata = TAIMessage & {
  id: string;
  createdAt: Date;
};
