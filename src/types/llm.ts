import { TToolCall } from "./tool";

export type TAIMessage =
  | { role: "system"; content: string }
  | { role: "assistant"; content: string; tool_calls?: TToolCall[] }
  | { role: "user"; content: string }
  | { role: "tool"; content: string; tool_call_id: string };

export type TMessageWithMetadata = TAIMessage & {
  id: string;
  createdAt: Date;
};
