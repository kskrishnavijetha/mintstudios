import { Sigma } from "lucide-react";

const Logo = () => {
  return (
    <div className="relative inline-flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-r from-sky-300 to-blue-300 opacity-20 blur-lg rounded-full" />
      <Sigma className="w-16 h-16 text-transparent bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text" />
    </div>
  );
};

export default Logo;