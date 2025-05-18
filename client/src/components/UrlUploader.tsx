import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { urlUploadSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Link, ExternalLink, Clipboard } from "lucide-react";
import { File as FileType } from "@shared/schema";

type UrlUploaderFormValues = z.infer<typeof urlUploadSchema>;

interface UrlUploaderProps {
  onUploadStart?: () => void;
  onUploadComplete?: (file: FileType) => void;
}

export default function UrlUploader({ onUploadStart, onUploadComplete }: UrlUploaderProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCopying, setIsCopying] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm<UrlUploaderFormValues>({
    resolver: zodResolver(urlUploadSchema),
    defaultValues: { url: "" },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: UrlUploaderFormValues) => {
      const response = await fetch("/api/upload/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload from URL");
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "URL upload successful!",
          description: `${data.file.filename} has been uploaded.`,
          variant: "default",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/files"] });
        setValue("url", "");
        
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

  const onSubmit = (data: UrlUploaderFormValues) => {
    if (onUploadStart) {
      onUploadStart();
    }
    uploadMutation.mutate(data);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.match(/^https?:\/\//)) {
        setValue("url", text);
      } else {
        setError("url", { message: "Clipboard doesn't contain a valid URL" });
      }
    } catch (err) {
      toast({
        title: "Clipboard access denied",
        description: "Please paste the URL manually",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
          URL to Download
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Link className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com/file.zip"
            className="pl-10 pr-20 py-6"
            {...register("url")}
            disabled={uploadMutation.isPending}
          />
          <div className="absolute inset-y-0 right-0 flex items-center mr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex items-center text-xs h-7 px-2 text-primary hover:text-primary/80"
              onClick={handlePaste}
              disabled={uploadMutation.isPending}
            >
              <Clipboard className="h-3 w-3 mr-1" />
              Paste
            </Button>
          </div>
        </div>
        {errors.url && (
          <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
        )}
      </div>

      <GradientButton
        type="submit"
        className="w-full flex justify-center items-center py-6 text-base"
        disabled={uploadMutation.isPending}
      >
        <ExternalLink className="mr-2 h-5 w-5" />
        {uploadMutation.isPending ? "Uploading..." : "Upload from URL"}
      </GradientButton>
    </form>
  );
}
