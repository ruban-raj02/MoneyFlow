import { Card } from "@/components/ui/card";
import { Transaction } from "@/contexts/AppContext";
import { format } from "date-fns";

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList = ({ transactions }: TransactionListProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="p-6 rounded-2xl border-border/50">
      <h3 className="text-lg font-semibold mb-6">Recent Transactions</h3>
      <div className="space-y-4 max-h-[400px] overflow-auto pr-2">
        {sortedTransactions.slice(0, 8).map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                transaction.type === "income"
                  ? "bg-success/10"
                  : "bg-secondary"
              }`}
            >
              <div
                className={`w-5 h-5 ${
                  transaction.type === "income"
                    ? "text-success"
                    : "text-foreground"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{transaction.description}</p>
              <p className="text-sm text-muted-foreground capitalize">
                {transaction.category.replace("-", " ")} • {format(new Date(transaction.date), "MMM d")}
              </p>
            </div>
            <div
              className={`font-semibold ${
                transaction.type === "income"
                  ? "text-success"
                  : "text-foreground"
              }`}
            >
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TransactionList;