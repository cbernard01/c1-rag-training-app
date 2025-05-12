import "dotenv/config";

import { parse } from "csv-parse/sync";
import fs from "node:fs";
import path from "node:path";
import { TEmbeddingService, embeddingService } from "./embedding-service";
import { TVectorService, vectorService } from "./vector-service";

const VECTOR_COLLECTION = String(process.env.VECTOR_COLLECTION);

if (!VECTOR_COLLECTION) {
  throw new Error("VECTOR_COLLECTION must be set");
}

interface IImportService {
  importAllMoviesFromCSV(dataSource: string): Promise<void>;
}

class ImportService implements IImportService {
  private readonly _vectorSvc: TVectorService;
  private readonly _embeddingSvc: TEmbeddingService;

  constructor() {
    this._vectorSvc = vectorService;
    this._embeddingSvc = embeddingService;
  }

  // Public methods

  /**
   * Import all records from a CSV file
   * @param dataSource - The name of the CSV file
   */
  async importAllMoviesFromCSV(dataSource: string): Promise<void> {
    const csvPath = path.resolve("./data", dataSource);
    const csvData = fs.readFileSync(csvPath, "utf8");
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    });

    console.log(`Importing ${records.length} records from ${csvPath}`);

    try {
      for (const record of records) {
        console.log(`Importing record ${record.title}`);
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
  private async _import(params: Partial<Record<string, string>>): Promise<void> {
    const content = `Movie: ${params.title}. Release date: ${params.release_date}. Vote Average: ${params.vote_average}. Overview: ${params.overview}`;

    const { embedding, contentHash } = await this._embeddingSvc.generate(content);

    try {
      await this._vectorSvc.create({
        collection: VECTOR_COLLECTION,
        vector: embedding,
        payload: {
          content: content,
          contentHash: contentHash,
          metadata: {
            title: params.title,
            releaseDate: params.release_date,
            voteAverage: params.vote_average,
            overview: params.overview,
            genre: params.genre,
            posterUrl: params.poster_url,
            popularity: params.popularity,
            voteCount: params.vote_count,
            originalLanguage: params.original_language,
          },
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
