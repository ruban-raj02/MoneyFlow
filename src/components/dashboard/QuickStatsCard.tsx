import { Card } from "@/components/ui/card";

interface QuickStatsCardProps {
  todaySpending: number;
  weekSpending: number;
  monthSpending: number;
  currencySymbol: string;
}

const QuickStatsCard = ({ todaySpending, weekSpending, monthSpending, currencySymbol }: QuickStatsCardProps) => {
  const formatAmount = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const stats = [
    { label: "Today", value: todaySpending },
    { label: "This Week", value: weekSpending },
    { label: "This Month", value: monthSpending },
  ];

  return (
    <Card className="p-6 rounded-2xl border-border/50">
      <h3 className="text-base font-semibold mb-4">Quick Stats</h3>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-secondary/60 dark:bg-secondary/30 border border-border/30 rounded-xl p-3 sm:p-4 text-center transition-all duration-300 ease-out hover:scale-[1.02]"
          >
            <p className="text-xs text-muted-foreground mb-1 break-words">{stat.label}</p>
            <p className="text-sm sm:text-lg font-semibold text-foreground break-words">
              {formatAmount(stat.value)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default QuickStatsCard;
