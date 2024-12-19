import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
  onClick: (e: React.FormEvent) => void;
}

export const SubmitButton = ({ isLoading, onClick }: SubmitButtonProps) => (
  <Button 
    className="w-full" 
    onClick={onClick}
    disabled={isLoading}
  >
    {isLoading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Creating Token...
      </>
    ) : (
      "Create Token"
    )}
  </Button>
);