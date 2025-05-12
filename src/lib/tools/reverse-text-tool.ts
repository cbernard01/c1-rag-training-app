import { TTool } from "@/types";

const reverseTextFunc = async ({ text }: { text: string }) => {
  console.log("reverseTextFunc called.");

  return text.split("").reverse().join("");
};

export const reverseTextTool: TTool<{ text: string }, string> = {
  name: "reverse_text",
  description: "Reverse the provided text",
  parameters: {
    type: "object",
    properties: {
      text: { type: "string", description: "The text to reverse" },
    },
    required: ["text"],
  },
  execute: reverseTextFunc,
};
