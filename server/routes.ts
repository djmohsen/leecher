import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { telegramClient } from "./telegram";
import multer from "multer";
import { insertFileSchema, urlUploadSchema } from "@shared/schema";
import os from "os";
import path from "path";
import { randomBytes } from "crypto";
import * as fs from "fs";
import { ZodError } from "zod";

const MAX_FILE_SIZE = 2000 * 1024 * 1024; // 2GB

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const tempDir = path.join(os.tmpdir(), "rapidleecher");
      
      // Ensure directory exists
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      cb(null, tempDir);
    },
    filename: (req, file, cb) => {
      const randomName = randomBytes(16).toString("hex");
      cb(null, `${randomName}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.post("/api/upload/url", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedData = urlUploadSchema.parse(req.body);
      
      // Check if we already have this file by downloading headers first and checking MD5
      const fileInfo = await telegramClient.uploadFromUrl(validatedData.url);
      
      // Check if file already exists by MD5 hash
      const existingFile = await storage.getFileByMd5Hash(fileInfo.md5Hash);
      
      if (existingFile) {
        return res.status(200).json({
          success: true,
          message: "File has already been uploaded",
          file: existingFile,
        });
      }
      
      // Create new file record
      const newFile = await storage.createFile({
        filename: fileInfo.filename,
        size: fileInfo.size,
        mime: fileInfo.mime,
        telegramFileId: fileInfo.fileId,
        md5Hash: fileInfo.md5Hash,
        source: "url",
        originalUrl: validatedData.url,
      });
      
      return res.status(201).json({
        success: true,
        message: "File uploaded successfully",
        file: newFile,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid request data",
          errors: error.errors,
        });
      }
      
      return res.status(500).json({
        success: false,
        message: (error as Error).message || "An unexpected error occurred",
      });
    }
  });
  
  app.post("/api/upload/file", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file provided",
        });
      }
      
      // Upload file to Telegram
      const fileInfo = await telegramClient.uploadFile(req.file);
      
      // Check if file already exists by MD5 hash
      const existingFile = await storage.getFileByMd5Hash(fileInfo.md5Hash);
      
      if (existingFile) {
        // Clean up temp file
        fs.unlinkSync(req.file.path);
        
        return res.status(200).json({
          success: true,
          message: "File has already been uploaded",
          file: existingFile,
        });
      }
      
      // Create new file record
      const newFile = await storage.createFile({
        filename: fileInfo.filename,
        size: fileInfo.size,
        mime: fileInfo.mime,
        telegramFileId: fileInfo.fileId,
        md5Hash: fileInfo.md5Hash,
        source: "direct",
        originalUrl: null,
      });
      
      // Clean up temp file
      fs.unlinkSync(req.file.path);
      
      return res.status(201).json({
        success: true,
        message: "File uploaded successfully",
        file: newFile,
      });
    } catch (error) {
      // Clean up temp file if it exists
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(500).json({
        success: false,
        message: (error as Error).message || "An unexpected error occurred",
      });
    }
  });
  
  app.get("/api/files", async (req: Request, res: Response) => {
    try {
      const files = await storage.getFiles();
      
      return res.status(200).json({
        success: true,
        files,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: (error as Error).message || "An unexpected error occurred",
      });
    }
  });
  
  app.get("/api/files/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid file ID",
        });
      }
      
      const file = await storage.getFile(id);
      
      if (!file) {
        return res.status(404).json({
          success: false,
          message: "File not found",
        });
      }
      
      return res.status(200).json({
        success: true,
        file,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: (error as Error).message || "An unexpected error occurred",
      });
    }
  });
  
  app.delete("/api/files/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid file ID",
        });
      }
      
      const deleted = await storage.deleteFile(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "File not found",
        });
      }
      
      return res.status(200).json({
        success: true,
        message: "File deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: (error as Error).message || "An unexpected error occurred",
      });
    }
  });
  
  // Stream file endpoint - proxies the file from Telegram to the user
  app.get("/download/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).send("Invalid file ID");
      }
      
      const file = await storage.getFile(id);
      
      if (!file) {
        return res.status(404).send("File not found");
      }
      
      // Increment download count
      await storage.incrementDownloadCount(id);
      
      // Set appropriate headers
      res.setHeader("Content-Type", file.mime);
      res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
      
      // Stream file from Telegram
      await telegramClient.streamFile(file.telegramFileId, res);
    } catch (error) {
      console.error("Error streaming file:", error);
      
      // If response has not been sent yet
      if (!res.headersSent) {
        res.status(500).send(`Error streaming file: ${(error as Error).message}`);
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
