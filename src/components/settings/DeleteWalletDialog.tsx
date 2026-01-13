import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { WalletItem } from "@/pages/Wallets";
import { Wallet } from "lucide-react";

interface DeleteWalletDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  wallet: WalletItem | null;
}

const DeleteWalletDialog = ({
  isOpen,
  onClose,
  onConfirm,
  wallet,
}: DeleteWalletDialogProps) => {
  if (!wallet) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="p-0 gap-0 overflow-hidden [&>button]:hidden rounded-2xl max-w-[calc(100%-2rem)] sm:max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-popover">
          <AlertDialogCancel className="text-muted-foreground hover:text-foreground font-semibold h-9 px-3 border-0 bg-transparent">
            Cancel
          </AlertDialogCancel>
          <h3 className="font-semibold text-base">Delete Wallet</h3>
          <AlertDialogAction
            onClick={onConfirm}
            className="text-destructive hover:text-destructive font-semibold h-9 px-3 bg-transparent hover:bg-transparent"
          >
            Delete
          </AlertDialogAction>
        </div>

        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-4">
            Are you sure you want to delete this wallet?
          </p>

          {/* Wallet Details */}
          <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="text-sm font-medium">{wallet.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Currency</span>
              <span className="text-sm font-medium">
                {wallet.currencySymbol} ({wallet.currency})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Country</span>
              <span className="text-sm font-medium">{wallet.country}</span>
            </div>
            {wallet.isActive && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-xs text-success font-medium bg-success/10 px-2 py-1 rounded-lg">
                  Active Wallet
                </span>
              </div>
            )}
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteWalletDialog;