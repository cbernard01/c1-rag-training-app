import { TTool } from "@/types";

const echoTextFunc = async ({ text }: { text: string }) => {
  console.log("echoTextFunc called.");

  return `Echo: ${text}`;
};

export const echoTextTool: TTool<{ text: string }, string> = {
  name: "echo_text",
  description: "Echo the provided text",
  parameters: {
    type: "object",
    properties: {
      text: { type: "string", description: "The text to echo" },
    },
    required: ["text"],
  },
  execute: echoTextFunc,
};
