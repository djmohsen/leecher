import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Upload, File } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { File as FileType } from "@shared/schema";

interface FileUploaderProps {
  onUploadStart?: () => void;
  onUploadComplete?: (file: FileType) => void;
}

export default function FileUploader({ onUploadStart, onUploadComplete }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/file", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || res.statusText);
      }

      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "File uploaded successfully!",
          description: `${data.file.filename} has been uploaded.`,
          variant: "default",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/files"] });
        
        if (onUploadComplete) {
          onUploadComplete(data.file);
        }
      } else {
        toast({
          title: "Upload failed",
          description: data.message || "Something went wrong",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: (error as Error).message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileUpload(file);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.size > 2 * 1024 * 1024 * 1024) { // 2GB
      toast({
        title: "File too large",
        description: "Maximum file size is 2GB",
        variant: "destructive",
      });
      return;
    }

    if (onUploadStart) {
      onUploadStart();
    }

    uploadMutation.mutate(file);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`upload-area cursor-pointer ${
        isDragging ? "border-primary border-dashed" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerFileInput}
    >
      <div className="space-y-1 text-center">
        {isDragging ? (
          <Upload className="mx-auto h-12 w-12 text-primary animate-pulse" />
        ) : (
          <File className="mx-auto h-12 w-12 text-gray-400" />
        )}
        <div className="flex text-sm text-gray-600">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
          >
            <span>Upload a file</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              disabled={uploadMutation.isPending}
            />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">Up to 2GB per file</p>
      </div>
    </div>
  );
}
