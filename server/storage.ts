import { files, type File, type InsertFile } from "@shared/schema";

export interface IStorage {
  getFile(id: number): Promise<File | undefined>;
  getFileByMd5Hash(md5Hash: string): Promise<File | undefined>;
  getFiles(): Promise<File[]>;
  createFile(file: InsertFile): Promise<File>;
  incrementDownloadCount(id: number): Promise<void>;
  deleteFile(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private files: Map<number, File>;
  private md5Index: Map<string, number>;
  private currentId: number;

  constructor() {
    this.files = new Map();
    this.md5Index = new Map();
    this.currentId = 1;
  }

  async getFile(id: number): Promise<File | undefined> {
    return this.files.get(id);
  }

  async getFileByMd5Hash(md5Hash: string): Promise<File | undefined> {
    const id = this.md5Index.get(md5Hash);
    if (id) {
      return this.files.get(id);
    }
    return undefined;
  }

  async getFiles(): Promise<File[]> {
    return Array.from(this.files.values()).sort((a, b) => {
      // Sort by uploadedAt desc
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    });
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const id = this.currentId++;
    const now = new Date();
    const file: File = {
      ...insertFile,
      id,
      downloads: 0,
      uploadedAt: now,
    };
    
    this.files.set(id, file);
    this.md5Index.set(file.md5Hash, id);
    
    return file;
  }

  async incrementDownloadCount(id: number): Promise<void> {
    const file = this.files.get(id);
    if (file) {
      file.downloads += 1;
      this.files.set(id, file);
    }
  }

  async deleteFile(id: number): Promise<boolean> {
    const file = this.files.get(id);
    if (file) {
      this.md5Index.delete(file.md5Hash);
      this.files.delete(id);
      return true;
    }
    return false;
  }
}

export const storage = new MemStorage();
