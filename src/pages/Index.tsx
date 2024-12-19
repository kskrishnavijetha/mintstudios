import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TokenCreationForm from "@/components/TokenCreationForm";
import WalletConnect from "@/components/WalletConnect";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-solana-purple to-solana-blue bg-clip-text text-transparent">
            Solana Token Creator
          </h1>
          <p className="text-muted-foreground">
            Create your own SPL token on Solana blockchain at just 0.03 SOL
          </p>
        </div>

        <div className="glass-card p-6 space-y-6">
          <h2 className="text-xl font-semibold">How to Create Your Token</h2>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Connect your Solana wallet</li>
            <li>Specify the desired name for your Token</li>
            <li>Indicate the symbol (max 8 characters)</li>
            <li>Select the decimals quantity (default recommended 6 for all tokens)</li>
            <li>Provide a brief description for your SPL Token</li>
            <li>Upload the image for your token (PNG)</li>
            <li>Determine the Supply of your Token</li>
            <li>Click on create, accept the transaction and wait until your tokens ready</li>
          </ol>
          <p className="text-sm text-muted-foreground mt-4">
            The cost of Token creation is 0.03 SOL, covering all fees for SPL Token Creation.
          </p>
        </div>

        <div className="flex justify-end">
          <WalletConnect />
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