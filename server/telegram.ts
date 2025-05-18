import fetch from "node-fetch";
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { randomBytes } from "crypto";
import { unlink } from "fs/promises";
import { createHash } from "crypto";
import * as path from "path";
import * as os from "os";

// Telegram API limits
const MAX_FILE_SIZE = 2000 * 1024 * 1024; // 2GB
const API_BASE_URL = "https://api.telegram.org/bot";

export interface TelegramFileInfo {
  fileId: string;
  size: number;
  mime: string;
  filename: string;
  md5Hash: string;
}

export class TelegramClient {
  private botToken: string;
  private channelId: string;
  
  constructor() {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const channelId = process.env.TELEGRAM_CHANNEL_ID;
    
    if (!botToken) {
      throw new Error("TELEGRAM_BOT_TOKEN environment variable is not set");
    }
    
    if (!channelId) {
      throw new Error("TELEGRAM_CHANNEL_ID environment variable is not set");
    }
    
    this.botToken = botToken;
    this.channelId = channelId;
  }
  
  private get apiUrl() {
    return `${API_BASE_URL}${this.botToken}`;
  }
  
  private async request(method: string, params: any = {}) {
    const url = `${this.apiUrl}/${method}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    
    const data = await response.json() as any;
    
    if (!data.ok) {
      throw new Error(`Telegram API error: ${data.description}`);
    }
    
    return data.result;
  }
  
  private async getFileStream(fileId: string): Promise<NodeJS.ReadableStream> {
    // Get file path first
    const fileInfo = await this.request("getFile", { file_id: fileId });
    const filePath = fileInfo.file_path;
    
    // Download file stream
    const fileUrl = `https://api.telegram.org/file/bot${this.botToken}/${filePath}`;
    const response = await fetch(fileUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }
    
    return response.body;
  }
  
  private calculateMd5Hash(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = createHash("md5");
      const stream = createReadStream(filePath);
      
      stream.on("error", err => reject(err));
      stream.on("data", chunk => hash.update(chunk));
      stream.on("end", () => resolve(hash.digest("hex")));
    });
  }

  async uploadFromUrl(url: string): Promise<TelegramFileInfo> {
    try {
      // Get file info from URL
      const response = await fetch(url, { method: "HEAD" });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
      }
      
      const contentLength = parseInt(response.headers.get("content-length") || "0", 10);
      
      if (contentLength > MAX_FILE_SIZE) {
        throw new Error(`File size (${contentLength} bytes) exceeds the maximum allowed size (${MAX_FILE_SIZE} bytes)`);
      }
      
      const contentType = response.headers.get("content-type") || "application/octet-stream";
      const disposition = response.headers.get("content-disposition");
      
      // Extract filename from URL or content-disposition
      let filename = "";
      
      if (disposition) {
        const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      if (!filename) {
        // Try to extract from URL
        const urlPath = new URL(url).pathname;
        const urlFilename = path.basename(urlPath);
        
        if (urlFilename && urlFilename.includes(".")) {
          filename = urlFilename;
        } else {
          // Generate random filename with appropriate extension
          const ext = contentType.split("/")[1] || "bin";
          filename = `file_${Date.now()}.${ext}`;
        }
      }
      
      // Download file to temporary location
      const tempFilePath = path.join(os.tmpdir(), `rapidleecher_${randomBytes(8).toString("hex")}`);
      const fileStream = createWriteStream(tempFilePath);
      
      const downloadResponse = await fetch(url);
      await pipeline(downloadResponse.body, fileStream);
      
      // Calculate MD5 hash
      const md5Hash = await this.calculateMd5Hash(tempFilePath);
      
      // Upload to Telegram
      const formData = new FormData();
      formData.append("chat_id", this.channelId);
      formData.append("caption", `File: ${filename}\nMD5: ${md5Hash}`);
      
      // Create file object for FormData
      const fileBuffer = await fetch(`file://${tempFilePath}`).then(res => res.arrayBuffer());
      const file = new Blob([fileBuffer], { type: contentType });
      formData.append("document", file, filename);
      
      const uploadResponse = await fetch(`${this.apiUrl}/sendDocument`, {
        method: "POST",
        body: formData,
      });
      
      const uploadResult = await uploadResponse.json() as any;
      
      if (!uploadResult.ok) {
        throw new Error(`Failed to upload to Telegram: ${uploadResult.description}`);
      }
      
      // Clean up temp file
      await unlink(tempFilePath);
      
      const document = uploadResult.result.document;
      
      return {
        fileId: document.file_id,
        size: document.file_size,
        mime: contentType,
        filename,
        md5Hash,
      };
    } catch (error) {
      throw new Error(`Error uploading file from URL: ${(error as Error).message}`);
    }
  }
  
  async uploadFile(file: Express.Multer.File): Promise<TelegramFileInfo> {
    try {
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size (${file.size} bytes) exceeds the maximum allowed size (${MAX_FILE_SIZE} bytes)`);
      }
      
      // Calculate MD5 hash
      const md5Hash = await this.calculateMd5Hash(file.path);
      
      // Upload to Telegram
      const formData = new FormData();
      formData.append("chat_id", this.channelId);
      formData.append("caption", `File: ${file.originalname}\nMD5: ${md5Hash}`);
      
      // Create file object for FormData
      const fileBuffer = await fetch(`file://${file.path}`).then(res => res.arrayBuffer());
      const fileBlob = new Blob([fileBuffer], { type: file.mimetype });
      formData.append("document", fileBlob, file.originalname);
      
      const uploadResponse = await fetch(`${this.apiUrl}/sendDocument`, {
        method: "POST",
        body: formData,
      });
      
      const uploadResult = await uploadResponse.json() as any;
      
      if (!uploadResult.ok) {
        throw new Error(`Failed to upload to Telegram: ${uploadResult.description}`);
      }
      
      const document = uploadResult.result.document;
      
      return {
        fileId: document.file_id,
        size: file.size,
        mime: file.mimetype,
        filename: file.originalname,
        md5Hash,
      };
    } catch (error) {
      throw new Error(`Error uploading file: ${(error as Error).message}`);
    }
  }
  
  async streamFile(fileId: string, res: any): Promise<void> {
    try {
      const fileStream = await this.getFileStream(fileId);
      fileStream.pipe(res);
    } catch (error) {
      throw new Error(`Error streaming file: ${(error as Error).message}`);
    }
  }
}

export const telegramClient = new TelegramClient();
