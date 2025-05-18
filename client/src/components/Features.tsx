import { 
  Zap, 
  Shield, 
  Link, 
  HardDrive 
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast Transfer",
      description: "Files are streamed directly from Telegram servers to your recipients with no intermediate storage."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Storage",
      description: "All files are stored on Telegram's secure servers with MD5 hash verification for integrity."
    },
    {
      icon: <Link className="h-6 w-6" />,
      title: "Direct URL Upload",
      description: "Fetch files directly from any URL without downloading to your device first."
    },
    {
      icon: <HardDrive className="h-6 w-6" />,
      title: "No Bandwidth Limits",
      description: "Upload and share files without worrying about bandwidth or storage limitations."
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for file sharing
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature, index) => (
              <div key={index} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  {feature.icon}
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
