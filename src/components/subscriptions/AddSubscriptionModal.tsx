import { useState, useEffect } from "react"; 
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Tv, Music, Cloud, Dumbbell, Gamepad2, Mail, Shield, Book, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { capitalizeWords } from "@/lib/capitalize";
import { useApp } from "@/contexts/AppContext";
import { Subscription } from "@/pages/Subscriptions";

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subscription: Omit<Subscription, "id">) => void;
  editSubscription?: Subscription | null;
}

const icons = [
  { id: "tv", icon: Tv, label: "TV/Streaming" },
  { id: "music", icon: Music, label: "Music" },
  { id: "cloud", icon: Cloud, label: "Cloud" },
  { id: "gym", icon: Dumbbell, label: "Fitness" },
  { id: "gaming", icon: Gamepad2, label: "Gaming" },
  { id: "mail", icon: Mail, label: "Email" },
  { id: "security", icon: Shield, label: "Security" },
  { id: "book", icon: Book, label: "Reading" },
  { id: "default", icon: CreditCard, label: "Other" },
];

const AddSubscriptionModal = ({ isOpen, onClose, onSave, editSubscription }: AddSubscriptionModalProps) => {
  const { wallets, activeWallet } = useApp();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [nextRenewal, setNextRenewal] = useState<Date>(new Date());
  const [frequency, setFrequency] = useState<"monthly" | "yearly" | "weekly">("monthly");
  const [wallet, setWallet] = useState(activeWallet?.id || wallets[0]?.id || "");
  const [selectedIcon, setSelectedIcon] = useState("default");

  useEffect(() => {
    if (editSubscription && isOpen) {
      setName(editSubscription.name);
      setAmount(editSubscription.amount.toString());
      setNextRenewal(new Date(editSubscription.nextRenewal));
      setFrequency(editSubscription.frequency);
      setWallet(editSubscription.wallet_id || activeWallet?.id || "");
      setSelectedIcon(editSubscription.icon);
    }
  }, [editSubscription, isOpen, activeWallet?.id]);

  const selectedWallet = wallets.find(w => w.id === wallet) || activeWallet;
  const currencySymbol = selectedWallet?.currencySymbol || "$";

  const handleSave = () => {
    if (!name || !amount || parseFloat(amount) <= 0) return;

    onSave({
      name,
      amount: parseFloat(amount),
      currency: selectedWallet?.currency || "USD",
      nextRenewal: nextRenewal.toISOString(),
      frequency,
      icon: selectedIcon,
      description: "",
      wallet_id: wallet,
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName("");
    setAmount("");
    setNextRenewal(new Date());
    setFrequency("monthly");
    setWallet(activeWallet?.id || wallets[0]?.id || "");
    setSelectedIcon("default");
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="p-0 gap-0 overflow-hidden [&>button]:hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-popover">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="text-destructive hover:text-destructive font-semibold h-9 px-3"
          >
            Cancel
          </Button>
          <h3 className="font-semibold text-base">{editSubscription ? "Edit Subscription" : "Add Subscription"}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={!name || !amount || parseFloat(amount) <= 0}
            className="text-primary hover:text-primary font-semibold h-9 px-3"
          >
            Save
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* Name */}
          <Input
            value={name}
            onChange={(e) => setName(capitalizeWords(e.target.value))}
            placeholder="Subscription name"
            className="rounded-xl h-11 border-transparent bg-secondary/50 focus:bg-secondary/70"
          />

          {/* Amount Card */}
          <Card className="p-4 sm:p-5 rounded-xl border-border/50 bg-secondary/30">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl sm:text-4xl font-light text-muted-foreground">{currencySymbol}</span>
              <input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="text-5xl sm:text-6xl font-semibold bg-transparent border-none outline-none text-center w-full max-w-[240px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </Card>

          {/* Next Renewal Date */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Next Renewal Date</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-xl h-11 border-transparent bg-secondary/50 hover:bg-secondary/70",
                    !nextRenewal && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                  <span className="truncate">{nextRenewal ? format(nextRenewal, "MMM d, yyyy") : "Select renewal date"}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50" align="start">
                <Calendar
                  mode="single"
                  selected={nextRenewal}
                  onSelect={(d) => d && setNextRenewal(d)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Frequency */}
          <Select value={frequency} onValueChange={(v) => setFrequency(v as "monthly" | "yearly" | "weekly")}>
            <SelectTrigger className="w-full rounded-xl h-11 border-transparent bg-secondary/50">
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>

          {/* Select Wallet */}
          <Select value={wallet} onValueChange={setWallet}>
            <SelectTrigger className="w-full rounded-xl h-11 border-transparent bg-secondary/50">
              <SelectValue placeholder="Choose wallet" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {wallets.map((w) => (
                <SelectItem key={w.id} value={w.id}>
                  {w.name} ({w.currency})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Choose Icon */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Choose icon</p>
            <div className="grid grid-cols-5 gap-2">
              {icons.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedIcon(item.id)}
                  className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-200",
                    selectedIcon === item.id
                      ? "bg-primary text-primary-foreground scale-105"
                      : "bg-secondary hover:bg-secondary/80"
                  )}
                >
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubscriptionModal;
