import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SecurityNotice = () => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Important Security Notice</AlertTitle>
      <AlertDescription className="mt-2">
        When connecting your wallet, you may see a warning message. This is normal for new dApps.
        Our application is open source and safe to use. We recommend:
        <ul className="list-disc list-inside mt-2">
          <li>Always verify the transaction details before signing</li>
          <li>Only connect your wallet if you trust the source</li>
          <li>Keep your wallet's security settings enabled</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default SecurityNotice;