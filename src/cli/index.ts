import "dotenv/config";

import { llmService, memoryService } from "@/services";

const userMessage = process.argv[2];

if (!userMessage) {
  console.error("Please provide a message to the LLM");
  process.exit(1);
}

async function main() {
  await memoryService.add({ role: "user", content: userMessage });
  const messages = await memoryService.getAll();

  const response = await llmService.run({ messages });

  await memoryService.add(response);

  console.log(response.content);
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
