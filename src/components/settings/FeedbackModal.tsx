import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Bug, Lightbulb, HelpCircle, Shield, X } from "lucide-react";
import { capitalizeWords } from "@/lib/capitalize";
import { toast } from "sonner";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

const feedbackTypes = [
  { value: "bug", label: "Bug Report", icon: Bug },
  { value: "feature", label: "Feature Request", icon: Lightbulb },
  { value: "general", label: "General Feedback", icon: HelpCircle },
];

const FeedbackModal = ({ isOpen, onClose, userEmail }: FeedbackModalProps) => {
  const [feedbackType, setFeedbackType] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendAnonymously, setSendAnonymously] = useState(true);

  const handleSubmit = async () => {
    if (!feedbackType || !message.trim()) {
      toast.error("Please select a feedback type and enter a message");
      return;
    }

    setIsSubmitting(true);
    
    console.log("Feedback data:", {
      type: feedbackType,
      message,
      anonymous: sendAnonymously,
      senderEmail: sendAnonymously ? undefined : userEmail,
    });
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success("Thank you for your feedback!");
    setFeedbackType("");
    setMessage("");
    setSendAnonymously(true);
    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    setFeedbackType("");
    setMessage("");
    setSendAnonymously(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 gap-0 overflow-hidden [&>button]:hidden rounded-2xl max-w-[calc(100%-2rem)] sm:max-w-md mx-auto [&_input]:text-base [&_textarea]:text-base">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-popover">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground font-semibold h-9 px-3"
          >
            Cancel
          </Button>
          <h3 className="font-semibold text-base">Send Feedback</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting || !feedbackType || !message.trim()}
            className="text-primary hover:text-primary font-semibold h-9 px-3"
          >
            {isSubmitting ? "Sending..." : "Send"}
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* Feedback Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Feedback Type</Label>
            <Select value={feedbackType} onValueChange={setFeedbackType}>
              <SelectTrigger className="rounded-xl h-11 border-transparent bg-secondary/50 focus:bg-secondary/70">
                <SelectValue placeholder="Select feedback type" />
              </SelectTrigger>
              <SelectContent>
                {feedbackTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="w-4 h-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Message</Label>
            <Textarea
              placeholder="Tell us what's on your mind..."
              value={message}
              onChange={(e) => setMessage(capitalizeWords(e.target.value))}
              className="min-h-[120px] rounded-xl resize-none border-transparent bg-secondary/50 focus:bg-secondary/70 text-base"
            />
          </div>

          {/* Anonymous Toggle */}
          <button
            type="button"
            onClick={() => setSendAnonymously(!sendAnonymously)}
            className={`flex items-center gap-2 text-xs rounded-xl px-4 py-3 w-full transition-colors ${
              sendAnonymously 
                ? "bg-primary/10 text-primary" 
                : "bg-secondary/30 text-muted-foreground"
            }`}
          >
            <Shield className="w-4 h-4 shrink-0" />
            <span>Send anonymously</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
