import { vectorService } from "@/services";
import { embeddingService } from "@/services/embedding-service";
import { TTool } from "@/types";

const VECTOR_COLLECTION = String(process.env.VECTOR_COLLECTION);

type TMovieMetadata = {
  title: string;
  releaseDate: string;
  voteAverage: string;
  overview: string;
  genre: string;
  posterUrl: string;
  popularity: string;
  voteCount: string;
  originalLanguage: string;
};

const movieSearchFunc = async ({ query }: { query: string }): Promise<string> => {
  console.log("movieSearchFunc called.");

  if (!VECTOR_COLLECTION) throw new Error("VECTOR_COLLECTION is not set");

  // 1. Embed the query
  const { embedding } = await embeddingService.generate(query);

  // 2. Find the most relevant movies
  const { results } = await vectorService.find({ collection: VECTOR_COLLECTION, vector: embedding, topK: 10 });

  // 3. Build a markdown list
  const lines = results.map((hit, i) => {
    const m = hit.payload.metadata as TMovieMetadata;
    return [
      `**${i + 1}. ${m.title}** (${m.releaseDate}) — Rating: ${m.voteAverage}/10`,
      `Overview: ${m.overview}`,
      `Genre: ${m.genre} • Language: ${m.originalLanguage}`,
      `Popularity: ${m.popularity} (${m.voteCount} votes)`,
      `Poster: ${m.posterUrl}`,
    ].join("\n");
  });

  return [`Here are the top ${results.length} result${results.length > 1 ? "s" : ""} for **"${query}"**:`, "", ...lines].join("\n\n");
};

export const movieSearchTool: TTool<{ query: string }, string> = {
  name: "movie_search",
  description:
    "Search for movies and information about them, including title, release date, overview, popularity, vote count, vote average, original language, genre, and poster URL. Use this to answer questions about movies.",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The query to search for movies",
      },
    },
    required: ["query"],
  },
  execute: movieSearchFunc,
};
