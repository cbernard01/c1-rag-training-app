import { TTool } from "@/types";

const getWeatherFunc = async ({ location }: { location: string }) => {
  return `The weather in ${location} is sunny and 75°F.`;
};

export const getWeatherTool: TTool<{ location: string }, string> = {
  name: "get_weather",
  description: "Get the weather for a given location",
  execute: getWeatherFunc,
};
