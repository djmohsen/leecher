import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBytes } from "@/lib/formatBytes";
import { formatDate } from "@/lib/formatDate";
import { getFileTypeIcon } from "@/lib/getFileTypeIcon";
import { Link, Download, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface FileDetailsProps {
  id: string;
}

export default function FileDetails({ id }: FileDetailsProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/files/${id}`],
  });

  const file = data?.file;
  const FileIcon = file ? getFileTypeIcon(file.mime) : null;

  const handleDownload = () => {
    if (file) {
      window.location.href = `/download/${file.id}`;
    }
  };

  const copyToClipboard = () => {
    if (!file) return;
    
    const link = `${window.location.origin}/file/${file.id}`;
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-8 w-64" /></CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex space-x-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !file) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading File</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Sorry, we couldn't load the file details. It may have been deleted or doesn't exist.</p>
          <Button className="mt-4" variant="outline" asChild>
            <a href="/">Go Back Home</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {FileIcon && <FileIcon className="h-6 w-6 text-primary" />}
          <span>{file.filename}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">File Details</h3>
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-3">
                <div className="col-span-1">
                  <dt className="text-xs text-gray-500">Size</dt>
                  <dd className="text-sm text-gray-900">{formatBytes(file.size)}</dd>
                </div>
                <div className="col-span-1">
                  <dt className="text-xs text-gray-500">Type</dt>
                  <dd className="text-sm text-gray-900">{file.mime}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs text-gray-500">MD5 Hash</dt>
                  <dd className="text-sm text-gray-900 font-mono text-xs break-all">{file.md5Hash}</dd>
                </div>
                <div className="col-span-1">
                  <dt className="text-xs text-gray-500">Downloads</dt>
                  <dd className="text-sm text-gray-900">{file.downloads}</dd>
                </div>
                <div className="col-span-1">
                  <dt className="text-xs text-gray-500">Uploaded</dt>
                  <dd className="text-sm text-gray-900">{formatDate(new Date(file.uploadedAt))}</dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-col space-y-2">
              <GradientButton
                className="flex items-center justify-center py-6"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-5 w-5" />
                Download File
              </GradientButton>
              
              <Button
                variant="outline"
                className="flex items-center justify-center py-6"
                onClick={copyToClipboard}
              >
                <Clipboard className="mr-2 h-5 w-5" />
                {copied ? "Copied!" : "Copy Share Link"}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-center bg-gray-50 rounded-lg p-8">
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                {FileIcon && <FileIcon className="h-12 w-12 text-primary" />}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">{file.filename}</h3>
              <p className="text-sm text-gray-500">{formatBytes(file.size)}</p>
              
              <div className="mt-6 text-xs text-gray-500">
                <p>Uploaded from {file.source === "url" ? "URL" : "direct upload"}</p>
                {file.originalUrl && (
                  <div className="mt-2 flex items-center justify-center">
                    <Link className="h-3 w-3 mr-1 text-primary" />
                    <a 
                      href={file.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate max-w-[200px] inline-block"
                    >
                      {file.originalUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
