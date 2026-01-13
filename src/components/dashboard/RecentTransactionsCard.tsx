import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { 
  Home, 
  ShoppingCart, 
  Utensils, 
  Film, 
  CreditCard, 
  Wallet, 
  TrendingUp, 
  Receipt,
  Lightbulb,
  Car,
  Wifi,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronDown,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditTransactionModal from "./EditTransactionModal";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import ViewTransactionModal from "./ViewTransactionModal";
import { Transaction } from "@/contexts/AppContext";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  rent: Home,
  groceries: ShoppingCart,
  food: Utensils,
  entertainment: Film,
  emi: CreditCard,
  "credit-card": CreditCard,
  salary: Wallet,
  freelance: TrendingUp,
  electricity: Lightbulb,
  fuel: Car,
  internet: Wifi,
  gas: Receipt,
  other: Receipt,
};

interface RecentTransactionsCardProps {
  transactions: Transaction[];
  currencySymbol?: string;
  onUpdate?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

const RecentTransactionsCard = ({ 
  transactions, 
  currencySymbol = "$",
  onUpdate,
  onDelete,
}: RecentTransactionsCardProps) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [transactionToView, setTransactionToView] = useState<Transaction | null>(null);
  const [showAll, setShowAll] = useState(false);

  const formatAmount = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const displayedTransactions = showAll ? sortedTransactions : sortedTransactions.slice(0, 5);
  const hasMore = sortedTransactions.length > 5;

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditModalOpen(true);
  };

  const handleView = (transaction: Transaction) => {
    setTransactionToView(transaction);
    setViewModalOpen(true);
  };

  const handleSave = (updated: Transaction) => {
    onUpdate?.(updated);
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      onDelete?.(transactionToDelete.id);
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  return (
    <>
      <Card className="p-6 rounded-2xl border-border/50">
        <h3 className="text-base font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-2">
          {displayedTransactions.map((transaction) => {
            const Icon = categoryIcons[transaction.category] || Receipt;
            return (
              <Card
                key={transaction.id}
                className="p-3 rounded-xl border-border/50 bg-secondary/30 dark:bg-secondary/20 hover:bg-secondary/50 transition-all duration-300 ease-out hover:scale-[1.01] group"
              >
                <div className="flex items-center gap-3">
                  {/* Left: Icon */}
                  <div
                    className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
                      transaction.type === "income"
                        ? "bg-success/20"
                        : "bg-muted"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        transaction.type === "income"
                          ? "text-success"
                          : "text-foreground"
                      }`}
                    />
                  </div>
                  
                  {/* Center: Category Name & Date */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate capitalize">{transaction.category.replace(/-/g, ' ')}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.date), "MMM d, h:mm a")}
                    </p>
                  </div>
                  
                  {/* Right: Amount */}
                  <div
                    className={`font-semibold text-sm whitespace-nowrap ${
                      transaction.type === "income"
                        ? "text-success"
                        : "text-foreground"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatAmount(transaction.amount)}
                  </div>
                  
                  {/* Actions */}
                  {(onUpdate || onDelete) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover z-50">
                        <DropdownMenuItem onClick={() => handleView(transaction)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(transaction)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </Card>
            );
          })}
          {transactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No transactions yet
            </div>
          )}
        </div>
        {hasMore && (
          <Button
            variant="ghost"
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-4 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-300 ease-out"
          >
            {showAll ? "Show Less" : "See More"}
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`} />
          </Button>
        )}
      </Card>

      <EditTransactionModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSave}
        onDelete={(id) => {
          const transaction = transactions.find((t) => t.id === id);
          if (transaction) handleDeleteClick(transaction);
        }}
        transaction={selectedTransaction}
        currencySymbol={currencySymbol}
      />

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        transaction={transactionToDelete}
        currencySymbol={currencySymbol}
      />

      <ViewTransactionModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        transaction={transactionToView}
        currencySymbol={currencySymbol}
      />
    </>
  );
};

export default RecentTransactionsCard;
