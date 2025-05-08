import { OpenAI } from "openai";
import { ZodType } from "zod";

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

type Parameters = ZodType;

export type TToolCall = OpenAI.Chat.Completions.ChatCompletionMessageToolCall;

export type TTool<A = unknown, T = unknown> = {
  name: string;
  parameters: Parameters;
  function: (input: { message: string; toolArgs: A }) => Promise<T>;
  description?: string | undefined;
};

export type TMessageWithMetadata = TAIMessage & {
  id: string;
  createdAt: Date;
};
