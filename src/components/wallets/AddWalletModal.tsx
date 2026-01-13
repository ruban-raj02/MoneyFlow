import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { WalletItem } from "@/pages/Wallets";
import { capitalizeWords } from "@/lib/capitalize";

interface AddWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (wallet: Omit<WalletItem, "id">) => void;
}

const currencies = [
  { code: "USD", symbol: "$", country: "America", display: "$USD" },
  { code: "EUR", symbol: "€", country: "Europe", display: "€EUR" },
  { code: "GBP", symbol: "£", country: "United Kingdom", display: "£GBP" },
  { code: "INR", symbol: "₹", country: "India", display: "₹INR" },
  { code: "JPY", symbol: "¥", country: "Japan", display: "¥JPY" },
  { code: "CAD", symbol: "C$", country: "Canada", display: "C$CAD" },
  { code: "AUD", symbol: "A$", country: "Australia", display: "A$AUD" },
  { code: "CNY", symbol: "¥", country: "China", display: "¥CNY" },
];

const AddWalletModal = ({ isOpen, onClose, onSave }: AddWalletModalProps) => {
  const [name, setName] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [isActive, setIsActive] = useState(false);

  const getCurrencyDetails = () => {
    return currencies.find((c) => c.code === selectedCurrency) || currencies[0];
  };

  const handleSave = () => {
    if (!name) return;

    const currencyDetails = getCurrencyDetails();

    onSave({
      name,
      currency: currencyDetails.code,
      currencySymbol: currencyDetails.symbol,
      country: currencyDetails.country,
      isActive,
    });

    // Reset form
    setName("");
    setSelectedCurrency("USD");
    setIsActive(false);
    onClose();
  };

  const handleCancel = () => {
    setName("");
    setSelectedCurrency("USD");
    setIsActive(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="p-0 gap-0 overflow-hidden max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-popover sticky top-0 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="text-destructive hover:text-destructive font-semibold h-9 px-3"
          >
            Cancel
          </Button>
          <h3 className="font-semibold text-base">Add Wallet</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={!name}
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
            placeholder="Wallet name"
            className="rounded-xl h-11 border-transparent bg-secondary/50 focus:bg-secondary/70"
          />

          {/* Currency */}
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="w-full rounded-xl h-11 border-transparent bg-secondary/50">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {currencies.map((curr) => (
                <SelectItem key={curr.code} value={curr.code}>
                  {curr.display} - {curr.country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Set as Active */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
            <Label htmlFor="active-toggle" className="cursor-pointer">
              Set as active wallet
            </Label>
            <Switch
              id="active-toggle"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Transactions will be recorded in the active wallet by default.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddWalletModal;
