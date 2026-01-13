import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Transaction } from "@/contexts/AppContext";

interface ViewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  currencySymbol?: string;
}

const ViewTransactionModal = ({
  isOpen,
  onClose,
  transaction,
  currencySymbol = "$",
}: ViewTransactionModalProps) => {
  if (!transaction) return null;

  const formatAmount = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 gap-0 overflow-hidden [&>button]:hidden rounded-2xl max-w-[calc(100%-2rem)] sm:max-w-sm mx-auto">
        {/* Header - same style as AddSubscriptionModal */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-popover">
          <div className="w-16" />
          <h3 className="font-semibold text-base">Transaction Details</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-primary hover:text-primary font-semibold h-9 px-3"
          >
            Close
          </Button>
        </div>

        <div className="p-4">
          {/* Transaction Details */}
          <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
            {/* Amount */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className={`text-sm font-semibold ${transaction.type === "income" ? "text-success" : "text-foreground"}`}>
                {transaction.type === "income" ? "+" : "-"}{formatAmount(transaction.amount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Type</span>
              <span className="text-sm font-medium capitalize">{transaction.type}</span>
            </div>
            <div className="flex justify-between items-start gap-2">
              <span className="text-sm text-muted-foreground shrink-0">Category</span>
              <span className="text-sm font-medium capitalize text-right break-words max-w-[60%]">{transaction.category.replace(/-/g, ' ')}</span>
            </div>
            {transaction.description && (
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-sm text-muted-foreground">Description</span>
                <span className="text-sm font-medium break-words whitespace-pre-wrap overflow-hidden word-break-break-word" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{transaction.description}</span>
              </div>
            )}
            <div className="flex justify-between items-start gap-2">
              <span className="text-sm text-muted-foreground shrink-0">Date</span>
              <span className="text-sm font-medium text-right">
                {format(new Date(transaction.date), "MMM d, yyyy h:mm a")}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTransactionModal;
