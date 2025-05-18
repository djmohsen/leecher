import { useState } from "react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import CTA from "@/components/CTA";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import FileUploader from "@/components/FileUploader";
import UrlUploader from "@/components/UrlUploader";
import UploadProgress from "@/components/UploadProgress";
import { File } from "@shared/schema";

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("Preparing upload...");
  const [completedFile, setCompletedFile] = useState<File | undefined>(undefined);
  const [showUploaders, setShowUploaders] = useState(true);

  // Simulated progress for visual feedback
  const startUploadSimulation = () => {
    setIsUploading(true);
    setShowUploaders(false);
    setUploadProgress(0);
    setUploadStatus("Preparing upload...");
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 30) setUploadStatus("Uploading to Telegram...");
      if (progress >= 60) setUploadStatus("Generating MD5 hash...");
      if (progress >= 85) setUploadStatus("Creating download link...");
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      
      setUploadProgress(progress);
    }, 300);
  };

  const handleUploadComplete = (file: File) => {
    setIsUploading(false);
    setCompletedFile(file);
  };

  const resetUpload = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setUploadStatus("Preparing upload...");
    setCompletedFile(undefined);
    setShowUploaders(true);
  };

  return (
    <div className="min-h-screen">
      <Hero />
      
      <section id="upload" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Upload Files</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Fast, Simple, Secure
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Share your files in seconds with our streamlined upload process.
            </p>
          </div>

          <div className="mt-10 max-w-3xl mx-auto">
            <Card className="border shadow-lg overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                {showUploaders ? (
                  <Tabs defaultValue="url" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="url">URL Upload</TabsTrigger>
                      <TabsTrigger value="file">File Upload</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="url" className="space-y-4">
                      <UrlUploader 
                        onUploadStart={startUploadSimulation}
                        onUploadComplete={handleUploadComplete}
                      />
                    </TabsContent>
                    
                    <TabsContent value="file">
                      <FileUploader 
                        onUploadStart={startUploadSimulation}
                        onUploadComplete={handleUploadComplete}
                      />
                    </TabsContent>
                  </Tabs>
                ) : null}
                
                <UploadProgress 
                  isUploading={isUploading}
                  completedFile={completedFile}
                  progress={uploadProgress}
                  status={uploadStatus}
                  reset={resetUpload}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <Features />
      <HowItWorks />
      <CTA />
    </div>
  );
}
