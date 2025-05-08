import "dotenv/config";

import { agentService } from "@/services";

const userMessage = process.argv[2];

if (!userMessage) {
  console.error("Please provide a message to the LLM");
  process.exit(1);
}

async function main() {
  const response = await agentService.execute(userMessage);
  console.log(response.content);
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
