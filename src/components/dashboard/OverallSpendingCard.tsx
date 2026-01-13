import { Card } from "@/components/ui/card";
import { Calendar, TrendingDown, TrendingUp } from "lucide-react";

interface OverallSpendingCardProps {
  totalSpending: number;
  totalIncome: number;
  month: string;
  currencySymbol: string;
}

const OverallSpendingCard = ({ totalSpending, totalIncome, month, currencySymbol }: OverallSpendingCardProps) => {
  const formatAmount = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <Card className="p-6 rounded-2xl border-border/50 bg-gradient-to-br from-primary/10 to-primary/5">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">{month}</span>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-destructive" />
            <p className="text-sm text-muted-foreground">Overall Spending</p>
          </div>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-destructive">
            {formatAmount(totalSpending)}
          </div>
        </div>
        <div className="sm:text-right">
          <div className="flex items-center gap-2 mb-1 sm:justify-end">
            <TrendingUp className="w-4 h-4 text-success" />
            <p className="text-sm text-muted-foreground">Overall Income</p>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-success">
            {formatAmount(totalIncome)}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OverallSpendingCard;
