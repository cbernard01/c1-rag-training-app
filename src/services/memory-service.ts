import { TAIMessage, TMessageWithMetadata } from "@/types";
import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import { v4 as uuidv4 } from "uuid";

const DATA_SOURCE = "data/db.json";

class MemoryService {
  private _memory!: Low<{ messages: TMessageWithMetadata[] }>;
  private static _instance: MemoryService;
  private _initialized: boolean = false;
  private _initPromise: Promise<void> | null = null;

  // Get the singleton instance of the MemoryService
  static getInstance(): MemoryService {
    if (!MemoryService._instance) {
      MemoryService._instance = new MemoryService();
      // Start initialization but don't wait for it
      MemoryService._instance._initPromise = MemoryService._instance._init();
    }
    return MemoryService._instance;
  }

  private constructor() {}

  // Public methods

  // Ensure the service is initialized before using it
  private async ensureInitialized(): Promise<void> {
    if (!this._initialized) {
      if (this._initPromise) {
        await this._initPromise;
      } else {
        this._initPromise = this._init();
        await this._initPromise;
      }
    }
  }

  // Add a message to the memory
  async add(message: TAIMessage) {
    await this.ensureInitialized();
    const messageWithMetadata = this._addMetadata(message);

    this._memory.data.messages.push(messageWithMetadata);
    await this._memory.write();
  }

  // Get all messages from the memory
  async getAll(): Promise<TAIMessage[]> {
    await this.ensureInitialized();
    return this._memory.data.messages.map(this._removeMetadata);
  }

  // Delete a message from the memory
  async delete(id: string): Promise<void> {
    await this.ensureInitialized();
    this._memory.data.messages = this._memory.data.messages.filter(message => message.id !== id);
    await this._memory.write();
  }

  // Clear all messages from the memory
  async clear(): Promise<void> {
    await this.ensureInitialized();
    this._memory.data.messages = [];
    await this._memory.write();
  }

  // Private methods

  // Add the metadata to a message
  private _addMetadata(message: TAIMessage): TMessageWithMetadata {
    return { ...message, id: uuidv4(), createdAt: new Date() };
  }

  // Remove the metadata from a message
  private _removeMetadata(message: TMessageWithMetadata): TAIMessage {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, ...rest } = message;

    return rest;
  }

  // Initialize the memory
  private async _init(): Promise<void> {
    try {
      const db = await JSONFilePreset<{ messages: TMessageWithMetadata[] }>(DATA_SOURCE, { messages: [] });
      this._memory = db;
      this._initialized = true;
    } catch (error) {
      console.error("Failed to initialize memory service:", error);
      throw error;
    }
  }
}

// Export the singleton instance
const memoryService = MemoryService.getInstance();

export { memoryService };
export type { MemoryService };
