import { Link } from "wouter";
import { Github, Twitter, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/">
              <span className="text-3xl font-bold text-white cursor-pointer">
                RapidLeecher
              </span>
            </Link>
            <p className="text-gray-300 text-base">
              Fast and secure file sharing powered by Telegram infrastructure.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">GitHub</span>
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Telegram</span>
                <Send className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Product
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      API
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Support
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      Guides
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Legal
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      Copyright
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Company
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} RapidLeecher. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
