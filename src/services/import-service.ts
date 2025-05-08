import "dotenv/config";

import { TMovie } from "@/types";
import { Index as UpstashIndex } from "@upstash/vector";
import { parse } from "csv-parse/sync";
import fs from "node:fs";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";

const UPSTASH_VECTOR_REST_URL = String(process.env.UPSTASH_VECTOR_REST_URL);
const UPSTASH_VECTOR_REST_TOKEN = String(process.env.UPSTASH_VECTOR_REST_TOKEN);

if (!UPSTASH_VECTOR_REST_URL || !UPSTASH_VECTOR_REST_TOKEN) {
  throw new Error("UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN must be set");
}

interface IImportService {
  importAllFromCSV(dataSource: string): Promise<void>;
}

class ImportService implements IImportService {
  private readonly _db: UpstashIndex;

  constructor() {
    this._db = new UpstashIndex({
      url: UPSTASH_VECTOR_REST_URL,
      token: UPSTASH_VECTOR_REST_TOKEN,
    });
  }

  // Public methods

  /**
   * Import all records from a CSV file
   * @param dataSource - The name of the CSV file
   */
  async importAllFromCSV(dataSource: string): Promise<void> {
    const csvPath = path.join("./", "/data", dataSource);
    const csvData = fs.readFileSync(csvPath, "utf8");
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    });

    try {
      for (const record of records) {
        await this._import(record);
      }
    } catch (error) {
      console.error("Error importing all records from CSV", error);
      throw error;
    }
  }

  // Private methods

  /**
   * Import a single movie
   * @param params - The TMovie object to import
   */
  private async _import(params: Partial<TMovie>): Promise<void> {
    const id = uuidv4();
    const content = `${params.title}. ${params.releaseDate}. ${params.voteAverage}. ${params.overview}`;

    try {
      await this._db.upsert({
        id,
        data: content,
        metadata: {
          title: params.title,
          releaseDate: params.releaseDate,
          voteAverage: params.voteAverage,
          overview: params.overview,
          genre: params.genre,
          posterUrl: params.posterUrl,
          popularity: params.popularity,
          voteCount: params.voteCount,
          originalLanguage: params.originalLanguage,
        },
      });
    } catch (error) {
      console.error("Error importing a single record", error);
      throw error;
    }
  }
}

const importService = new ImportService();

type TImportService = typeof importService;

export { importService };
export type { TImportService };
