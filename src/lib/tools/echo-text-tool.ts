import { TTool } from "@/types";

const echoTextFunc = async ({ text }: { text: string }) => {
  return `Echo: ${text}`;
};

export const echoTextTool: TTool<{ text: string }, string> = {
  name: "echo_text",
  description: "Echo the provided text",
  execute: echoTextFunc,
};
