export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-12">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">How It Works</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Simple, Fast, and Secure
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our technology leverages Telegram's robust infrastructure for reliable file storage and streaming.
          </p>
        </div>

        <div className="relative">
          <div className="relative lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="relative">
              <div className="prose prose-primary text-gray-500 mx-auto lg:max-w-none">
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">Upload Process</h3>
                <p>When you upload a file, RapidLeecher:</p>
                <ol>
                  <li>Calculates the MD5 hash of your file for verification</li>
                  <li>Securely transfers your file to our Telegram channel</li>
                  <li>Stores file metadata for easy retrieval</li>
                  <li>Generates a unique shareable link</li>
                </ol>
                <p>This process happens instantly, with no intermediate storage on our servers.</p>
              </div>
            </div>

            <div className="mt-10 -mx-4 relative lg:mt-0">
              <div className="relative rounded-lg shadow-lg overflow-hidden">
                <svg 
                  className="floating-animation relative mx-auto w-full h-64 lg:h-96 bg-gray-50 p-4" 
                  viewBox="0 0 500 400" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="250" cy="200" r="100" fill="#e0e7ff" />
                  <rect x="150" y="150" width="200" height="100" rx="10" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
                  <path d="M175 200l50 -30l50 30l50 -30" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="175" cy="200" r="8" fill="#4f46e5" />
                  <circle cx="225" cy="170" r="8" fill="#4f46e5" />
                  <circle cx="275" cy="200" r="8" fill="#4f46e5" />
                  <circle cx="325" cy="170" r="8" fill="#4f46e5" />
                  <path d="M150 250l25 25l-25 25" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M175 275h50" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" />
                  <path d="M350 250l-25 25l25 25" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M325 275h-50" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" />
                  <rect x="200" y="75" width="100" height="50" rx="8" fill="#4f46e5" />
                  <path d="M225 100h50" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M225 115h30" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <rect x="200" y="300" width="100" height="50" rx="8" fill="#ec4899" />
                  <path d="M225 325h50" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M225 340h30" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M250 75v-25" stroke="#4f46e5" strokeWidth="2" />
                  <path d="M250 350v25" stroke="#ec4899" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-24">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div className="relative lg:order-2">
                <div className="prose prose-primary text-gray-500 mx-auto lg:max-w-none">
                  <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">Download Process</h3>
                  <p>When someone downloads your shared file:</p>
                  <ol>
                    <li>RapidLeecher locates the file in our Telegram channel using the MD5 hash</li>
                    <li>We establish a direct stream between Telegram and the user</li>
                    <li>Data flows in real-time without being stored on our servers</li>
                    <li>This proxy approach ensures maximum speed and privacy</li>
                  </ol>
                  <p>The result is a fast, secure download experience with no bandwidth limitations.</p>
                </div>
              </div>

              <div className="mt-10 -mx-4 relative lg:mt-0 lg:order-1">
                <div className="relative rounded-lg shadow-lg overflow-hidden">
                  <svg 
                    className="floating-animation relative mx-auto w-full h-64 lg:h-96 bg-gray-50 p-4" 
                    viewBox="0 0 500 400" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="250" cy="200" r="120" fill="#fce7f3" />
                    <rect x="100" y="175" width="100" height="50" rx="8" fill="#4f46e5" />
                    <rect x="300" y="175" width="100" height="50" rx="8" fill="#ec4899" />
                    <path d="M200 200h100" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeDasharray="10 5" />
                    <rect x="225" y="175" width="50" height="50" rx="8" fill="white" stroke="#4f46e5" strokeWidth="2" />
                    <path d="M235 200h30" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
                    <path d="M235 210h20" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
                    <path d="M150 175v-50h200v50" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 5" />
                    <circle cx="250" cy="125" r="20" fill="#ec4899" />
                    <path d="M240 125h20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <path d="M250 115v20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <path d="M125 225l10 10l10 -10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M375 225l-10 10l-10 -10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M100 250c20 40 80 60 150 60c70 0 130 -20 150 -60" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 5" />
                    <rect x="225" y="310" width="50" height="30" rx="4" fill="#4f46e5" />
                    <path d="M235 325h30" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
