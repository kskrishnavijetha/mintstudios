import { CREATION_FEE } from "@/utils/transactionUtils";

export const FeeDisplay = () => {
  return (
    <div className="text-sm text-muted-foreground">
      Creation fee: {CREATION_FEE} SOL
    </div>
  );
};