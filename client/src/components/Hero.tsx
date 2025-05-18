import { Link } from "wouter";
import { GradientButton } from "./ui/gradient-button";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Share files</span>
                <span className="block text-primary xl:inline">instantly with Telegram</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Upload your files once, share them anywhere. RapidLeecher uses Telegram as a secure backbone to store and stream your files with lightning speed.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link href="#upload">
                    <GradientButton className="w-full flex items-center justify-center px-8 py-3 md:py-4 md:text-lg md:px-10">
                      Start Uploading
                    </GradientButton>
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link href="#how-it-works">
                    <Button 
                      variant="outline"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 md:py-4 md:text-lg md:px-10"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        {/* Data transfer illustration */}
        <svg
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full bg-gray-100 p-4"
          viewBox="0 0 800 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="800" height="600" fill="#f8fafc" />
          <circle cx="400" cy="300" r="150" fill="#e0e7ff" />
          <path
            d="M535 250c0 85-70 155-155 155s-155-70-155-155 70-155 155-155 155 70 155 155z"
            fill="#a5b4fc"
          />
          <path
            d="M325 250l150 100M325 350l150-100"
            stroke="#4f46e5"
            strokeWidth="15"
            strokeLinecap="round"
          />
          <circle cx="325" cy="250" r="30" fill="#4f46e5" />
          <circle cx="325" cy="350" r="30" fill="#4f46e5" />
          <circle cx="475" cy="250" r="30" fill="#4f46e5" />
          <circle cx="475" cy="350" r="30" fill="#4f46e5" />
          <path
            d="M210 180c-20 20-30 45-30 75s10 55 30 75M590 180c20 20 30 45 30 75s-10 55-30 75"
            stroke="#4f46e5"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M160 130c-30 30-50 70-50 120s20 90 50 120M640 130c30 30 50 70 50 120s-20 90-50 120"
            stroke="#ec4899"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}
