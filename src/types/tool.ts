export type TTool<Input = Record<string, unknown>, Output = string> = {
  name: string;
  description: string;
  execute: (params: Input) => Promise<Output>;
};

export type TToolCall = {
  id: string;
  function: {
    name: string;
    arguments?: string;
  };
};
