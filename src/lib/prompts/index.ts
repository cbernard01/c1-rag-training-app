import { TAIMessage } from "@/types";

const defaultPrompt: TAIMessage = {
  role: "system",
  content:
    "You are an assistant that strictly responds using only the provided context. Do not include any information not present in the context messages, even if you have prior knowledge. Only use the provided context.",
};

const restrictivePrompt: TAIMessage = {
  role: "system",
  content:
    "You are an assistant that strictly responds using only the provided context. Do not include any information not present in the context messages, even if you have prior knowledge. Only use the provided context. If you don't have any context, respond with 'I don't know'. Don't make up any information or using anything other than the context.",
};

export const systemPrompts = {
  default: defaultPrompt,
  restrictive: restrictivePrompt,
};
