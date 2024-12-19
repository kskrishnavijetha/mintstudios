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
      <DropdownMenuContent align="end" className="w-[200px] bg-popover">
        <DropdownMenuItem 
          onClick={() => onConnect('phantom')}
          className="cursor-pointer"
        >
          Connect Phantom
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onConnect('solflare')}
          className="cursor-pointer"
        >
          Connect Solflare
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DisconnectedWallet;