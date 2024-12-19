import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export const FreezeAuthorityRevoker = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRevoke = async () => {
    setIsLoading(true);
    // Simulate revocation
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Revoke Freeze Authority</h3>
        <span className="text-sm text-muted-foreground">Fee: 0.03 SOL</span>
      </div>
      <Button 
        onClick={handleRevoke} 
        disabled={isLoading}
        variant="secondary"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Revoking Freeze Authority...
          </>
        ) : (
          "Revoke Freeze Authority"
        )}
      </Button>
    </div>
  );
};