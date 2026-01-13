import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface AnalyticsCardsProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

const AnalyticsCards = ({ totalIncome, totalExpenses, balance }: AnalyticsCardsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Total Balance */}
      <Card className="p-6 rounded-2xl border-border/50 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">Total Balance</span>
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div className="text-3xl font-semibold tracking-tight">
          {formatCurrency(balance)}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {balance >= 0 ? "You're in good shape!" : "Time to save more"}
        </p>
      </Card>

      {/* Total Income */}
      <Card className="p-6 rounded-2xl border-border/50 bg-gradient-to-br from-success/10 to-success/5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">Total Income</span>
          <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
        </div>
        <div className="text-3xl font-semibold tracking-tight text-success">
          {formatCurrency(totalIncome)}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          This month's earnings
        </p>
      </Card>

      {/* Total Expenses */}
      <Card className="p-6 rounded-2xl border-border/50 bg-gradient-to-br from-destructive/10 to-destructive/5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">Total Expenses</span>
          <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-destructive" />
          </div>
        </div>
        <div className="text-3xl font-semibold tracking-tight text-destructive">
          {formatCurrency(totalExpenses)}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          This month's spending
        </p>
      </Card>
    </div>
  );
};

export default AnalyticsCards;