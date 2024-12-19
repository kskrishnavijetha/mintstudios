import { CREATION_FEE, FEE_RECIPIENT } from "@/utils/transactionUtils";

export const FeeDisplay = () => (
  <div className="p-4 rounded-lg bg-secondary/50">
    <p className="text-sm text-muted-foreground">
      Creation Fee: <span className="text-foreground">{CREATION_FEE} SOL</span>
      <br />
      <span className="text-xs">
        Fee recipient: {FEE_RECIPIENT.toString()}
      </span>
    </p>
  </div>
);