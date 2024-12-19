import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import ConnectedWallet from "./wallet/ConnectedWallet";
import DisconnectedWallet from "./wallet/DisconnectedWallet";

interface WalletConnectProps {
  label?: string;
}

const WalletConnect = ({ label = "Connect Wallet" }: WalletConnectProps) => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const { solana } = window;
        if ((solana?.isPhantom || solana?.isSolflare) && solana.isConnected) {
          const response = await solana.connect({ onlyIfTrusted: true });
          setConnected(true);
          setPublicKey(response.publicKey.toString());
        }
      } catch (error) {
        console.error("Auto-connect error:", error);
        setConnected(false);
        setPublicKey(null);
      }
    };

    checkWalletConnection();

    window.solana?.on('connect', () => {
      checkWalletConnection();
    });

    window.solana?.on('disconnect', () => {
      setConnected(false);
      setPublicKey(null);
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
    });

    return () => {
      window.solana?.removeAllListeners('connect');
      window.solana?.removeAllListeners('disconnect');
    };
  }, [toast]);

  const handleConnect = async (walletType: 'phantom' | 'solflare') => {
    try {
      setConnecting(true);
      const { solana } = window;
      
      if (walletType === 'phantom' && !solana?.isPhantom) {
        toast({
          variant: "destructive",
          title: "Phantom Wallet Not Found",
          description: "Please install Phantom wallet",
        });
        window.open("https://phantom.app/", "_blank");
        return;
      }

      if (walletType === 'solflare' && !solana?.isSolflare) {
        toast({
          variant: "destructive",
          title: "Solflare Wallet Not Found",
          description: "Please install Solflare wallet",
        });
        window.open("https://solflare.com/", "_blank");
        return;
      }

      const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
      const resp = await solana.connect();
      const walletPubKey = new PublicKey(resp.publicKey.toString());
      const walletAddress = walletPubKey.toString();
      
      try {
        const balance = await connection.getBalance(walletPubKey);
        console.log("Connected to wallet:", walletAddress);
        console.log("Wallet balance:", balance / 1e9, "SOL");
      } catch (error) {
        console.error("Error fetching balance:", error);
      }

      setConnected(true);
      setPublicKey(walletAddress);
      
      toast({
        title: `${walletType === 'phantom' ? 'Phantom' : 'Solflare'} Wallet Connected`,
        description: `Connected to ${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Failed to connect to wallet. Please try again.",
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const { solana } = window;
      if (solana) {
        await solana.disconnect();
        setConnected(false);
        setPublicKey(null);
        
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected",
        });
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Disconnect Failed",
        description: "Failed to disconnect wallet. Please try again.",
      });
    }
  };

  if (connected) {
    return (
      <ConnectedWallet
        publicKey={publicKey}
        onDisconnect={handleDisconnect}
        label={label}
      />
    );
  }

  return (
    <DisconnectedWallet
      connecting={connecting}
      onConnect={handleConnect}
      label={label}
    />
  );
};

export default WalletConnect;