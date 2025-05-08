import { TTool } from "@/types";
import { z } from "zod";

export const movieSearchTool: TTool<{ query: string }, string> = {
  name: "movie_search",
  description: "Search for a movie by title",
  parameters: z.object({
    query: z.string().describe("The query to search for"),
  }),
  function: async ({}: { message: string; toolArgs: { query: string } }) => {
    return "The movie search tool is not implemented yet";
  },
};
