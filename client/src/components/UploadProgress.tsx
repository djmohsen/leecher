import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { File as FileType } from "@shared/schema";
import { formatBytes } from "@/lib/formatBytes";
import { AlertCircle, CheckCircle2, Clipboard } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UploadProgressProps {
  isUploading: boolean;
  completedFile?: FileType;
  progress?: number;
  status?: string;
  reset: () => void;
}

export default function UploadProgress({
  isUploading,
  completedFile,
  progress = 0,
  status = "Uploading...",
  reset,
}: UploadProgressProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const [progressWidth, setProgressWidth] = useState("0%");
  const [speed, setSpeed] = useState("0 KB/s");

  useEffect(() => {
    if (isUploading) {
      setProgressWidth(`${progress}%`);
      
      // Simulate speed
      const randomSpeed = Math.floor(Math.random() * 5 * 1024) + 1024;
      setSpeed(`${(randomSpeed / 1024).toFixed(1)} MB/s`);
    }
  }, [isUploading, progress]);

  const getShareLink = (id: number) => {
    const host = window.location.origin;
    return `${host}/file/${id}`;
  };

  const copyToClipboard = () => {
    if (!completedFile) return;
    
    const link = getShareLink(completedFile.id);
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopied(true);
        toast({
          title: "Link copied to clipboard",
          description: "You can now share it with others",
        });
        
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      })
      .catch(() => {
        toast({
          title: "Failed to copy",
          description: "Please try again or copy manually",
          variant: "destructive",
        });
      });
  };

  if (!isUploading && !completedFile) {
    return null;
  }

  if (isUploading) {
    return (
      <div className="mt-6 animate-in fade-in-50 duration-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Uploading file</span>
          <span className="text-sm font-medium text-gray-700">{`${Math.round(progress)}%`}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="progress-bar h-2.5 rounded-full transition-[width]"
            style={{ width: progressWidth }}
          ></div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>{status}</span>
          <span>{speed}</span>
        </div>
      </div>
    );
  }

  if (completedFile) {
    return (
      <div className="mt-6 space-y-4 animate-in fade-in-50 duration-300">
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800 text-sm font-medium">Upload complete</AlertTitle>
          <AlertDescription className="text-green-700 text-sm">
            Your file has been successfully uploaded. Share it using the link below.
          </AlertDescription>
        </Alert>
        
        <div>
          <label htmlFor="share-link" className="block text-sm font-medium text-gray-700">
            Share Link
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <Input
              id="share-link"
              type="text"
              className="flex-1 rounded-none rounded-l-md"
              value={getShareLink(completedFile.id)}
              readOnly
            />
            <Button
              type="button"
              onClick={copyToClipboard}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white gradient-btn"
            >
              <Clipboard className="h-4 w-4 mr-2" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
          <h4 className="text-sm font-medium text-gray-700">File Details</h4>
          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="col-span-1">
              <dt className="text-xs text-gray-500">Name</dt>
              <dd className="text-sm text-gray-900">{completedFile.filename}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-xs text-gray-500">Size</dt>
              <dd className="text-sm text-gray-900">{formatBytes(completedFile.size)}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-xs text-gray-500">Type</dt>
              <dd className="text-sm text-gray-900">{completedFile.mime}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-xs text-gray-500">MD5 Hash</dt>
              <dd className="text-sm text-gray-900 truncate">{completedFile.md5Hash}</dd>
            </div>
          </dl>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button 
            variant="outline"
            onClick={reset}
          >
            Upload Another File
          </Button>
          <GradientButton
            onClick={() => window.location.href = `/file/${completedFile.id}`}
          >
            View File
          </GradientButton>
        </div>
      </div>
    );
  }

  return null;
}
