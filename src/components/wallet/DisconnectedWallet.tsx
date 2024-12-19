import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DisconnectedWalletProps {
  connecting: boolean;
  onConnect: (walletType: 'phantom' | 'solflare') => void;
  label?: string;
}

const DisconnectedWallet = ({ connecting, onConnect, label = "Connect Wallet" }: DisconnectedWalletProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={connecting}
          className="relative min-w-[140px] justify-center"
        >
          {connecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            label
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onConnect('phantom')}>
          Connect Phantom
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onConnect('solflare')}>
          Connect Solflare
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DisconnectedWallet;