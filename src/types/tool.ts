export type TTool<Input = Record<string, unknown>, Output = string> = {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, { type: string; description: string }>;
    required: string[];
  };
  execute: (params: Input) => Promise<Output>;
};

export type TToolCall = {
  id: string;
  function: {
    name: string;
    arguments?: string;
  };
};
