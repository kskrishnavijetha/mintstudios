import { Card } from "@/components/ui/card";
import TokenCreationForm from "@/components/TokenCreationForm";
import WalletConnect from "@/components/WalletConnect";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex justify-end mb-4">
        <WalletConnect />
      </div>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-solana-purple to-solana-blue bg-clip-text text-transparent">
            Solana Token Creator
          </h1>
          <p className="text-muted-foreground">
            Create your own SPL token on Solana blockchain
          </p>
        </div>

        <Card className="glass-card p-6">
          <TokenCreationForm />
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Powered by Solana blockchain
        </p>
      </div>
    </div>
  );
};

export default Index;