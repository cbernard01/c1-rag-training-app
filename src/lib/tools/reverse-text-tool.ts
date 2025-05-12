import { TTool } from "@/types";

const reverseTextFunc = async ({ text }: { text: string }) => {
  console.log("text.split('').reverse().join('')", text.split("").reverse().join(""));
  return text.split("").reverse().join("");
};

export const reverseTextTool: TTool<{ text: string }, string> = {
  name: "reverse_text",
  description: "Reverse the provided text",
  execute: reverseTextFunc,
};
