import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Link as LinkIcon, 
  Download, 
  Trash2, 
  ExternalLink 
} from "lucide-react";
import { Link } from "wouter";
import { formatBytes } from "@/lib/formatBytes";
import { formatDate } from "@/lib/formatDate";
import { getFileTypeIcon } from "@/lib/getFileTypeIcon";
import { File } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface FileCardProps {
  file: File;
}

export default function FileCard({ file }: FileCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const FileIcon = getFileTypeIcon(file.mime);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/files/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to delete file");
      }
      
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "File deleted",
        description: "The file has been successfully deleted",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const handleCopyLink = () => {
    const url = `${window.location.origin}/file/${file.id}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast({
          title: "Link copied!",
          description: "File link copied to clipboard",
        });
      })
      .catch(() => {
        toast({
          title: "Failed to copy",
          description: "Please try again",
          variant: "destructive",
        });
      });
  };

  const handleDownload = () => {
    window.location.href = `/download/${file.id}`;
  };

  const handleDelete = () => {
    deleteMutation.mutate(file.id);
  };

  return (
    <Card className="file-card hover:shadow-lg transition-all">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <FileIcon className="text-primary h-6 w-6" />
          </div>
          
          <div className="flex-1 min-w-0">
            <Link href={`/file/${file.id}`}>
              <a className="text-sm font-medium text-gray-900 hover:text-primary truncate block">
                {file.filename}
              </a>
            </Link>
            <div className="text-xs text-gray-500 truncate mt-1">
              MD5: {file.md5Hash}
            </div>
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <span>{formatBytes(file.size)}</span>
              <span>{formatDate(new Date(file.uploadedAt))}</span>
              <span>{file.downloads} downloads</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyLink}
              className="h-8 w-8 text-primary hover:text-primary/80 hover:bg-primary/10"
            >
              <LinkIcon className="h-4 w-4" />
              <span className="sr-only">Copy Link</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <Download className="h-4 w-4" />
              <span className="sr-only">Download</span>
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the file "{file.filename}". This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
