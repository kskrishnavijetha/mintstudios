import { Sparkles } from "lucide-react";

const Logo = () => {
  return (
    <div className="relative inline-flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-r from-solana-purple to-solana-blue opacity-20 blur-lg rounded-full" />
      <Sparkles className="w-16 h-16 text-transparent bg-gradient-to-r from-solana-purple to-solana-blue bg-clip-text" />
    </div>
  );
};

export default Logo;