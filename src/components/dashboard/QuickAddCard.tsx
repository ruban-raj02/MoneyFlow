import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Lightbulb, Flame, ShoppingCart, Car, Wifi, CreditCard, MoreHorizontal } from "lucide-react";

interface QuickAddItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const quickAddItems: QuickAddItem[] = [
  { id: "rent", name: "Rent", icon: Home },
  { id: "electricity", name: "Electricity", icon: Lightbulb },
  { id: "gas", name: "Cooking Gas", icon: Flame },
  { id: "groceries", name: "Groceries", icon: ShoppingCart },
  { id: "fuel", name: "Fuel", icon: Car },
  { id: "internet", name: "Internet", icon: Wifi },
  { id: "credit-card", name: "Credit Card", icon: CreditCard },
  { id: "other", name: "Other", icon: MoreHorizontal },
];

interface QuickAddCardProps {
  onQuickAdd: (itemId: string) => void;
}

const QuickAddCard = ({ onQuickAdd }: QuickAddCardProps) => {
  return (
    <Card className="p-6 rounded-2xl border-border/50">
      <h3 className="text-base font-semibold mb-4">Quick Add</h3>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {quickAddItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => onQuickAdd(item.id)}
            className="flex flex-col items-center gap-1.5 h-auto py-3 px-2 rounded-xl hover:bg-secondary"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <item.icon className="w-5 h-5 text-foreground" />
            </div>
            <span className="text-xs font-medium text-muted-foreground truncate w-full text-center">
              {item.name}
            </span>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default QuickAddCard;
