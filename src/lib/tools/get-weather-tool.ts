import { TTool } from "@/types";
import { z } from "zod";

const getWeatherFunc = async ({ toolArgs }: { message: string; toolArgs: { location: string } }) => {
  return `The weather in ${toolArgs.location} is sunny`;
};

export const getWeatherTool: TTool<{ location: string; date?: string }, string> = {
  name: "get_weather",
  description: "Get the weather for a given location",
  parameters: z.object({
    location: z.string().describe("The location to get the weather for"),
  }),
  function: getWeatherFunc,
};
