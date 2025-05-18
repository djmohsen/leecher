import { useParams } from "wouter";
import FileDetails from "@/components/FileDetails";

export default function FilePage() {
  const { id } = useParams();
  
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:text-center mb-8">
        <h2 className="text-base text-primary font-semibold tracking-wide uppercase">File Details</h2>
        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Download & Share
        </p>
      </div>
      
      <FileDetails id={id || ""} />
    </div>
  );
}
