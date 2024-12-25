import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const SecurityNotice = () => {
  return (
    <Alert variant="warning" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Security Notice</AlertTitle>
      <AlertDescription className="mt-2 text-sm space-y-2">
        <p>
          When using this dApp, you may see a warning from your wallet that the app is potentially malicious. 
          This is a standard security measure for new dApps. To ensure your safety:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Always verify transaction details before signing</li>
          <li>Check that the fee amount matches the expected 0.03 SOL</li>
          <li>Ensure you&apos;re connected to the correct Solana network (devnet)</li>
          <li>Never share your wallet&apos;s secret recovery phrase</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default SecurityNotice;