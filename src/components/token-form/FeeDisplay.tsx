import { CREATION_FEE } from "@/utils/transactionUtils";

export const FeeDisplay = () => (
  <div className="p-4 rounded-lg bg-secondary/50">
    <p className="text-sm text-muted-foreground">
      Creation Fee: <span className="text-foreground">{CREATION_FEE} SOL</span>
    </p>
  </div>
);