import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Film, Music, Cloud, Tv, CreditCard, Dumbbell, Gamepad2, Mail, Shield, Book } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useApp } from "@/contexts/AppContext";
import { differenceInDays } from "date-fns";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  nextRenewal: string;
  frequency: "monthly" | "yearly" | "weekly";
  icon: string;
  wallet_id: string | null;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  tv: Tv,
  music: Music,
  cloud: Cloud,
  gym: Dumbbell,
  gaming: Gamepad2,
  mail: Mail,
  security: Shield,
  book: Book,
  netflix: Film,
  default: CreditCard,
};

interface UpcomingSubscriptionsCardProps {
  currencySymbol: string;
}

const UpcomingSubscriptionsCard = ({ 
  currencySymbol
}: UpcomingSubscriptionsCardProps) => {
  const { user } = useAuth();
  const { activeWallet } = useApp();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && activeWallet) {
      fetchSubscriptions();
    }
  }, [user, activeWallet?.id]);

  const fetchSubscriptions = async () => {
    if (!user || !activeWallet) return;

    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("wallet_id", activeWallet.id)
        .eq("is_active", true)
        .order("next_billing_date", { ascending: true })
        .limit(5);

      if (error) throw error;

      const mapped: Subscription[] = (data || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        amount: parseFloat(s.amount),
        nextRenewal: s.next_billing_date,
        frequency: s.billing_cycle,
        icon: s.category || "default",
        wallet_id: s.wallet_id,
      }));

      setSubscriptions(mapped);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case "weekly":
        return "/wk";
      case "monthly":
        return "/mo";
      case "yearly":
        return "/yr";
      default:
        return "";
    }
  };

  return (
    <Card className="p-6 rounded-2xl border-border/50">
      <h3 className="text-base font-semibold mb-4">Upcoming Subscriptions</h3>
      {loading ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          Loading...
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No subscriptions added yet
        </div>
      ) : (
        <div className="space-y-3">
          {subscriptions.map((sub) => {
            const Icon = iconMap[sub.icon] || iconMap.default;
            const daysUntil = differenceInDays(new Date(sub.nextRenewal), new Date());

            return (
              <div
                key={sub.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{sub.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Renews in {Math.abs(daysUntil)} days
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">
                    {formatAmount(sub.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getFrequencyLabel(sub.frequency)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default UpcomingSubscriptionsCard;
