import "dotenv/config";

import { importService } from "@/services";

async function main() {
  await importService.importAllMoviesFromCSV("movies.csv");
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
