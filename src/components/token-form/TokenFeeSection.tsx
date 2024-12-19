import { useEffect, useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

interface TokenFeeSectionProps {
  walletAddress: string | null;
}

export const TokenFeeSection = ({ walletAddress }: TokenFeeSectionProps) => {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!walletAddress) {
        setBalance(null);
        return;
      }

      try {
        const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
        const pubKey = new PublicKey(walletAddress);
        const bal = await connection.getBalance(pubKey);
        setBalance(bal / 1e9); // Convert lamports to SOL
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance(null);
      }
    };

    fetchBalance();
  }, [walletAddress]);

  return (
    <div className="bg-muted p-4 rounded-lg mb-6">
      <h4 className="font-medium mb-2">Token Creation Fee</h4>
      <div className="space-y-2 text-sm">
        <p>Base Fee: 0.001 SOL</p>
        {walletAddress && (
          <p>Wallet Balance: {balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}</p>
        )}
        {!walletAddress && (
          <p className="text-muted-foreground">Connect wallet to view balance</p>
        )}
      </div>
    </div>
  );
};