import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface EraseDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

const EraseDataDialog = ({ isOpen, onClose, onConfirm, isDeleting = false }: EraseDataDialogProps) => {
  const handleErase = () => {
    onConfirm();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="p-0 gap-0 overflow-hidden [&>button]:hidden rounded-2xl max-w-[calc(100%-2rem)] sm:max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-popover">
          <AlertDialogCancel
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground font-semibold h-9 px-3 border-0 bg-transparent"
          >
            Cancel
          </AlertDialogCancel>
          <h3 className="font-semibold text-base">Erase All Data</h3>
          <AlertDialogAction
            onClick={handleErase}
            disabled={isDeleting}
            className="text-destructive hover:text-destructive font-semibold h-9 px-3 bg-transparent hover:bg-transparent"
          >
            Erase
          </AlertDialogAction>
        </div>

        <div className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <p className="text-sm text-muted-foreground">This action will permanently delete all your data including:</p>
          </div>

          <div className="p-4 rounded-xl bg-destructive/10 space-y-2">
            <ul className="text-sm text-destructive space-y-1">
              <li>• All transactions (expenses & income)</li>
              <li>• All wallets</li>
              <li>• All subscriptions</li>
              <li>• All income sources</li>
              <li>• Your profile data</li>
            </ul>
          </div>

          <p className="text-sm text-destructive font-medium text-center mt-4">⚠️ This action cannot be undone!</p>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EraseDataDialog;