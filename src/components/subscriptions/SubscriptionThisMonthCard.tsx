import { Card } from "@/components/ui/card";
import { Subscription } from "@/pages/Subscriptions";
import { isThisMonth } from "date-fns";

interface SubscriptionThisMonthCardProps {
  subscriptions: Subscription[];
  walletName?: string;
  currencySymbol?: string;
}

const SubscriptionThisMonthCard = ({
  subscriptions,
  walletName = "Main Wallet",
  currencySymbol = "$",
}: SubscriptionThisMonthCardProps) => {
  // Filter subscriptions renewing this month
  const thisMonthSubscriptions = subscriptions.filter((sub) =>
    isThisMonth(new Date(sub.nextRenewal))
  );

  const totalAmount = thisMonthSubscriptions.reduce(
    (sum, sub) => sum + sub.amount,
    0
  );

  const formatAmount = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Card className="p-6 rounded-2xl border-border/50 bg-gradient-to-br from-card to-secondary/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold">Subscriptions This Month</h3>
          <p className="text-sm text-muted-foreground">{walletName}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">
            {formatAmount(totalAmount)}
          </p>
          <p className="text-xs text-muted-foreground">
            {thisMonthSubscriptions.length} subscription{thisMonthSubscriptions.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {thisMonthSubscriptions.length > 0 ? (
        <div className="space-y-2">
          {thisMonthSubscriptions.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 dark:bg-secondary/20"
            >
            <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{sub.name}</p>
                {sub.wallet_id && (
                  <p className="text-xs text-muted-foreground">{sub.wallet_id}</p>
                )}
              </div>
              <p className="font-semibold text-sm whitespace-nowrap ml-3">
                {formatAmount(sub.amount)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground text-sm">
          No subscriptions due this month
        </div>
      )}
    </Card>
  );
};

export default SubscriptionThisMonthCard;
