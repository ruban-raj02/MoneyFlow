import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { capitalizeWords } from "@/lib/capitalize";
import { useApp } from "@/contexts/AppContext";

interface AddExpenseIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    amount: number;
    date: Date;
    wallet: string;
    description: string;
    category: string;
    type: "expense" | "income";
  }) => void;
  type: "expense" | "income";
}

const expenseCategories = [
  { id: "food", name: "Food & Dining" },
  { id: "groceries", name: "Groceries" },
  { id: "rent", name: "Rent" },
  { id: "utilities", name: "Utilities" },
  { id: "entertainment", name: "Entertainment" },
  { id: "transport", name: "Transport" },
  { id: "healthcare", name: "Healthcare" },
  { id: "shopping", name: "Shopping" },
  { id: "other", name: "Other" },
];

const incomeCategories = [
  { id: "salary", name: "Salary" },
  { id: "freelance", name: "Freelance" },
  { id: "investment", name: "Investment" },
  { id: "bonus", name: "Bonus" },
  { id: "gift", name: "Gift" },
  { id: "other", name: "Other" },
];

const AddExpenseIncomeModal = ({
  isOpen,
  onClose,
  onSave,
  type,
}: AddExpenseIncomeModalProps) => {
  const { wallets, activeWallet } = useApp();
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [wallet, setWallet] = useState(wallets.find(w => w.isActive)?.id || wallets[0]?.id || "");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  // Get currency symbol from selected wallet
  const selectedWallet = wallets.find(w => w.id === wallet);
  const currencySymbol = selectedWallet?.currencySymbol || activeWallet?.currencySymbol || "$";

  const handleClear = () => {
    setAmount("");
  };

  const handleSave = () => {
    if (!amount || parseFloat(amount) <= 0 || !category) return;

    onSave({
      amount: parseFloat(amount),
      date,
      wallet,
      description,
      category,
      type,
    });

    // Reset form
    setAmount("");
    setDate(new Date());
    setWallet(wallets.find(w => w.isActive)?.id || wallets[0]?.id || "");
    setDescription("");
    setCategory("");
    onClose();
  };

  const handleCancel = () => {
    setAmount("");
    setDate(new Date());
    setWallet(wallets.find(w => w.isActive)?.id || wallets[0]?.id || "");
    setDescription("");
    setCategory("");
    onClose();
  };

  const categories = type === "expense" ? expenseCategories : incomeCategories;

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="p-0 gap-0 overflow-hidden max-h-[90vh] overflow-y-auto [&>button]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-popover sticky top-0 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="text-destructive hover:text-destructive font-semibold h-9 px-3"
          >
            Cancel
          </Button>
          <h3 className="font-semibold text-base">
            Add {type === "expense" ? "Expense" : "Income"}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={!amount || parseFloat(amount) <= 0 || !category}
            className="text-primary hover:text-primary font-semibold h-9 px-3"
          >
            Save
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* Amount Card */}
          <Card className="p-5 rounded-xl border-border bg-secondary/50 dark:bg-secondary/30">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl sm:text-4xl font-light text-muted-foreground">{currencySymbol}</span>
              <input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="text-6xl sm:text-7xl font-semibold bg-transparent border-none outline-none text-center w-full max-w-[280px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </Card>

          {/* Category Selection */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full rounded-xl h-11 border-transparent bg-secondary/50">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date & Time */}
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start text-left font-normal rounded-xl h-11 min-w-0 border-transparent bg-secondary/50 hover:bg-secondary/70",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                  <span className="truncate">{date ? format(date, "MMM d, yyyy") : "Pick date"}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(new Date(d.setHours(date.getHours(), date.getMinutes())))}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <input
              type="time"
              value={format(date, "HH:mm")}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':').map(Number);
                const newDate = new Date(date);
                newDate.setHours(hours, minutes);
                setDate(newDate);
              }}
              className="w-24 h-11 rounded-xl border-transparent bg-secondary/50 px-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
            />
          </div>

          {/* Clear Button */}
          <Button
            variant="ghost"
            onClick={handleClear}
            className="w-full rounded-xl text-muted-foreground hover:text-foreground h-10"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Amount
          </Button>

          {/* Select Wallet */}
          <Select value={wallet} onValueChange={setWallet}>
            <SelectTrigger className="w-full rounded-xl h-11 border-transparent bg-secondary/50">
              <SelectValue placeholder="Select wallet" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {wallets.map((w) => (
                <SelectItem key={w.id} value={w.id}>
                  {w.name} ({w.currency})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Description */}
          <Textarea
            value={description}
            onChange={(e) => setDescription(capitalizeWords(e.target.value))}
            placeholder="Add a description (optional)"
            className="rounded-xl resize-none border-transparent bg-secondary/50"
            rows={3}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseIncomeModal;
