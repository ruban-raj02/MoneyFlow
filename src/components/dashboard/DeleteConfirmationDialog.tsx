import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { Transaction } from "@/contexts/AppContext";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction: Transaction | null;
  currencySymbol?: string;
}

const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  transaction,
  currencySymbol = "$",
}: DeleteConfirmationDialogProps) => {
  if (!transaction) return null;

  const formatAmount = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="p-0 gap-0 overflow-hidden [&>button]:hidden rounded-2xl max-w-[calc(100%-2rem)] sm:max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-popover">
          <AlertDialogCancel className="text-muted-foreground hover:text-foreground font-semibold h-9 px-3 border-0 bg-transparent">
            Cancel
          </AlertDialogCancel>
          <h3 className="font-semibold text-base">Delete Transaction</h3>
          <AlertDialogAction
            onClick={onConfirm}
            className="text-destructive hover:text-destructive font-semibold h-9 px-3 bg-transparent hover:bg-transparent"
          >
            Delete
          </AlertDialogAction>
        </div>

        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-4">
            Are you sure you want to delete this transaction?
          </p>

          {/* Transaction Details */}
          <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
            {transaction.description && (
              <div className="flex flex-col gap-1 min-w-0 overflow-hidden">
                <span className="text-sm text-muted-foreground">Description</span>
                <span className="text-sm font-medium break-words whitespace-pre-wrap overflow-hidden" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{transaction.description}</span>
              </div>
            )}
            <div className="flex justify-between items-start gap-2">
              <span className="text-sm text-muted-foreground shrink-0">Category</span>
              <span className="text-sm font-medium capitalize text-right break-words max-w-[60%]">{transaction.category.replace("-", " ")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className={`text-sm font-semibold ${transaction.type === "income" ? "text-success" : "text-foreground"}`}>
                {transaction.type === "income" ? "+" : "-"}{formatAmount(transaction.amount)}
              </span>
            </div>
            <div className="flex justify-between items-start gap-2">
              <span className="text-sm text-muted-foreground shrink-0">Date</span>
              <span className="text-sm font-medium text-right">
                {format(new Date(transaction.date), "MMM d, yyyy h:mm a")}
              </span>
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
