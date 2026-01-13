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
import { 
  CreditCard, 
  Wallet, 
  TrendingUp, 
  Briefcase, 
  Gift, 
  DollarSign,
  Receipt 
} from "lucide-react";

interface DeleteIncomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  income: Transaction | null;
  currency?: string;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  salary: Wallet,
  freelance: TrendingUp,
  business: Briefcase,
  investment: TrendingUp,
  gift: Gift,
  bonus: DollarSign,
  other: Receipt,
};

const DeleteIncomeDialog = ({
  isOpen,
  onClose,
  onConfirm,
  income,
  currency = "USD",
}: DeleteIncomeDialogProps) => {
  if (!income) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const Icon = categoryIcons[income.category] || CreditCard;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-2xl w-[calc(100%-2rem)] max-w-sm mx-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Delete Income
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Are you sure you want to delete this income?
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Income Details */}
        <div className="my-4 p-4 rounded-xl bg-secondary/50 space-y-3">
          {/* Icon + Category */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-success/20 flex items-center justify-center">
              <Icon className="w-6 h-6 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold capitalize">
                {income.category.replace("-", " ")}
              </p>
            </div>
          </div>
          
          {/* Description */}
          <div className="flex flex-col gap-1 pt-2 border-t border-border/30">
            <span className="text-sm text-muted-foreground">Description</span>
            <span className="text-sm font-medium break-words">
              {income.description}
            </span>
          </div>
          
          {/* Amount */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Amount</span>
            <span className="text-sm font-semibold text-success">
              +{formatCurrency(income.amount)}
            </span>
          </div>
          
          {/* Date & Time */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Date & Time</span>
            <span className="text-sm font-medium">
              {format(new Date(income.date), "MMM d, yyyy h:mm a")}
            </span>
          </div>
        </div>

        <AlertDialogFooter className="flex-row gap-3 sm:gap-3">
          <AlertDialogCancel className="flex-1 rounded-xl h-11 font-semibold m-0">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="flex-1 rounded-xl h-11 font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Yes, Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteIncomeDialog;