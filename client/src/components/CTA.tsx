import { Link } from "wouter";
import { Button } from "./ui/button";

export default function CTA() {
  return (
    <section className="bg-gradient-to-r from-primary to-secondary">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">Ready to start sharing?</span>
          <span className="block text-indigo-100">Create your account today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Link href="/">
              <Button
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50"
              >
                Get started
              </Button>
            </Link>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <Link href="#how-it-works">
              <Button
                variant="secondary"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary/20 hover:bg-primary/30"
              >
                Learn more
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
