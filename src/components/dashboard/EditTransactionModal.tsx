import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { capitalizeWords } from "@/lib/capitalize";
import { Transaction } from "@/contexts/AppContext";

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  transaction: Transaction | null;
  currencySymbol?: string;
}

const categories = [
  { id: "rent", name: "Rent" },
  { id: "groceries", name: "Groceries" },
  { id: "food", name: "Food" },
  { id: "entertainment", name: "Entertainment" },
  { id: "emi", name: "EMI" },
  { id: "credit-card", name: "Credit Card" },
  { id: "electricity", name: "Electricity" },
  { id: "gas", name: "Cooking Gas" },
  { id: "fuel", name: "Fuel" },
  { id: "internet", name: "Internet" },
  { id: "salary", name: "Salary" },
  { id: "freelance", name: "Freelance" },
  { id: "other", name: "Other" },
];

const wallets = [
  { id: "main", name: "Main Wallet" },
  { id: "savings", name: "Savings" },
  { id: "credit", name: "Credit Card" },
];

const EditTransactionModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  transaction,
  currencySymbol = "$",
}: EditTransactionModalProps) => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setDate(new Date(transaction.date));
      setCategory(transaction.category);
      setType(transaction.type);
      setDescription(transaction.description);
    }
  }, [transaction]);

  const handleSave = () => {
    if (!amount || parseFloat(amount) <= 0 || !transaction) return;

    onSave({
      ...transaction,
      amount: parseFloat(amount),
      date: date.toISOString(),
      category,
      type,
      description,
    });
    onClose();
  };

  const handleDelete = () => {
    if (transaction) {
      onDelete(transaction.id);
      onClose();
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);
    setDate(newDate);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 gap-0 overflow-hidden max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-popover sticky top-0 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-destructive hover:text-destructive font-semibold h-9 px-3"
          >
            Cancel
          </Button>
          <h3 className="font-semibold text-base">Edit Transaction</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={!amount || parseFloat(amount) <= 0}
            className="text-primary hover:text-primary font-semibold h-9 px-3"
          >
            Save
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* Type Toggle */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setType("expense")}
              className={cn(
                "flex-1 rounded-xl h-10 border-transparent",
                type === "expense" 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "bg-popover hover:bg-popover/80"
              )}
            >
              Expense
            </Button>
            <Button
              variant="outline"
              onClick={() => setType("income")}
              className={cn(
                "flex-1 rounded-xl h-10 border-transparent",
                type === "income" 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "bg-popover hover:bg-popover/80"
              )}
            >
              Income
            </Button>
          </div>

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

          {/* Category */}
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
              onChange={handleTimeChange}
              className="w-24 h-11 rounded-xl border-transparent bg-secondary/50 px-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
            />
          </div>

          {/* Description */}
          <Textarea
            value={description}
            onChange={(e) => setDescription(capitalizeWords(e.target.value))}
            placeholder="Description"
            className="rounded-xl resize-none border-transparent bg-secondary/50"
            rows={3}
          />

          {/* Delete Button */}
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="w-full rounded-xl"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionModal;