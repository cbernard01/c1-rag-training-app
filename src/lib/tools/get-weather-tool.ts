import { TTool } from "@/types";

const getWeatherFunc = async ({ location }: { location: string }) => {
  console.log("getWeatherFunc called.");

  return `The weather in ${location} is sunny and 75°F.`;
};

export const getWeatherTool: TTool<{ location: string }, string> = {
  name: "get_weather",
  description: "Get the weather for a given location",
  parameters: {
    type: "object",
    properties: {
      location: { type: "string", description: "The location to get the weather for" },
    },
    required: ["location"],
  },
  execute: getWeatherFunc,
};
