import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DisconnectedWalletProps {
  connecting: boolean;
  onConnect: (walletType: 'phantom' | 'solflare') => void;
  label?: string;
}

const DisconnectedWallet = ({ connecting, onConnect, label = "Connect Wallet" }: DisconnectedWalletProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        disabled={connecting}
        onClick={() => onConnect('phantom')}
        className="relative min-w-[140px] justify-center"
      >
        {connecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          "Connect Phantom"
        )}
      </Button>
      <Button
        disabled={connecting}
        onClick={() => onConnect('solflare')}
        className="relative min-w-[140px] justify-center"
      >
        {connecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          "Connect Solflare"
        )}
      </Button>
    </div>
  );
};

export default DisconnectedWallet;