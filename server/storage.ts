import { files, type File, type InsertFile } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getFile(id: number): Promise<File | undefined>;
  getFileByMd5Hash(md5Hash: string): Promise<File | undefined>;
  getFiles(): Promise<File[]>;
  createFile(file: InsertFile): Promise<File>;
  incrementDownloadCount(id: number): Promise<void>;
  deleteFile(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getFile(id: number): Promise<File | undefined> {
    const results = await db.select().from(files).where(eq(files.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getFileByMd5Hash(md5Hash: string): Promise<File | undefined> {
    const results = await db.select().from(files).where(eq(files.md5Hash, md5Hash));
    return results.length > 0 ? results[0] : undefined;
  }

  async getFiles(): Promise<File[]> {
    // Sort by uploadedAt desc
    return db.select().from(files).orderBy(desc(files.uploadedAt));
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    // Ensure originalUrl is null if undefined (PostgreSQL doesn't accept undefined)
    const fileWithNullUrl = {
      ...insertFile,
      originalUrl: insertFile.originalUrl || null
    };
    
    const result = await db.insert(files).values(fileWithNullUrl).returning();
    return result[0];
  }

  async incrementDownloadCount(id: number): Promise<void> {
    const file = await this.getFile(id);
    if (file) {
      await db
        .update(files)
        .set({ downloads: file.downloads + 1 })
        .where(eq(files.id, id));
    }
  }

  async deleteFile(id: number): Promise<boolean> {
    const result = await db.delete(files).where(eq(files.id, id)).returning();
    return result.length > 0;
  }
}

// Initialize the database storage
export const storage = new DatabaseStorage();
