import { TTool } from "@/types";

export const movieSearchTool: TTool<{ query: string }, string> = {
  name: "movie_search",
  description: "Search for a movie by title",
  execute: async ({ query }: { query: string }) => {
    return `The movie search tool is not implemented yet for ${query}`;
  },
};
