import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { capitalizeWords } from "@/lib/capitalize";
import { supabase } from "@/integrations/supabase/client";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  name: string;
  country: string;
  hasUsedBefore: boolean;
  currentlyTracking: boolean;
  trackingFrequency: string;
}

const countries = [
  { value: "us", label: "United States", symbol: "$" },
  { value: "uk", label: "United Kingdom", symbol: "£" },
  { value: "eu", label: "European Union", symbol: "€" },
  { value: "in", label: "India", symbol: "₹" },
  { value: "jp", label: "Japan", symbol: "¥" },
  { value: "au", label: "Australia", symbol: "A$" },
  { value: "ca", label: "Canada", symbol: "C$" },
  { value: "other", label: "Other", symbol: "$" },
];

const OnboardingModal = ({ isOpen, onComplete }: OnboardingModalProps) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [hasUsedBefore, setHasUsedBefore] = useState<boolean | null>(null);
  const [currentlyTracking, setCurrentlyTracking] = useState<boolean | null>(null);
  const [trackingFrequency, setTrackingFrequency] = useState("");

  const totalSteps = 5;

  const canProceed = () => {
    switch (step) {
      case 1:
        return name.trim().length > 0;
      case 2:
        return country.length > 0;
      case 3:
        return hasUsedBefore !== null;
      case 4:
        return currentlyTracking !== null;
      case 5:
        return trackingFrequency.length > 0;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Save name into Supabase Auth (Settings uses this)
      await supabase.auth.updateUser({
        data: {
          full_name: name
        }
      });
  
      onComplete({
        name,
        country,
        hasUsedBefore: hasUsedBefore ?? false,
        currentlyTracking: currentlyTracking ?? false,
        trackingFrequency,
      });
    }
  };
  

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (!isOpen) return null;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-56 md:w-80 h-56 md:h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <span className="text-2xl font-semibold tracking-tight">
            Money<span className="text-primary">Flow</span>
          </span>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  i < step ? "bg-primary" : "bg-secondary"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Step {step} of {totalSteps}
          </p>
        </motion.div>

        {/* Card */}
        <div className="bg-card rounded-3xl p-6 md:p-8 shadow-xl border border-border/50 dark:bg-popover overflow-hidden">
          <AnimatePresence mode="wait" custom={1}>
            <motion.div
              key={step}
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">What's your name?</h2>
                    <p className="text-sm text-muted-foreground">
                      Let's personalize your experience
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Your name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(capitalizeWords(e.target.value))}
                      className="h-12 rounded-xl text-center text-lg"
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Where are you from?</h2>
                    <p className="text-sm text-muted-foreground">
                      This helps us set your default currency
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Country/Region</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent className="z-[60]">
                        {countries.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label} ({c.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">
                      Have you used an expense tracker before?
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      We'll customize the experience for you
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={hasUsedBefore === true ? "default" : "outline"}
                      className="h-14 rounded-xl text-base font-medium"
                      onClick={() => setHasUsedBefore(true)}
                    >
                      {hasUsedBefore === true && <Check className="w-4 h-4 mr-2" />}
                      Yes
                    </Button>
                    <Button
                      variant={hasUsedBefore === false ? "default" : "outline"}
                      className="h-14 rounded-xl text-base font-medium"
                      onClick={() => setHasUsedBefore(false)}
                    >
                      {hasUsedBefore === false && <Check className="w-4 h-4 mr-2" />}
                      No
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">
                      Do you currently track your expenses?
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Whether on paper, spreadsheets, or apps
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={currentlyTracking === true ? "default" : "outline"}
                      className="h-14 rounded-xl text-base font-medium"
                      onClick={() => setCurrentlyTracking(true)}
                    >
                      {currentlyTracking === true && <Check className="w-4 h-4 mr-2" />}
                      Yes
                    </Button>
                    <Button
                      variant={currentlyTracking === false ? "default" : "outline"}
                      className="h-14 rounded-xl text-base font-medium"
                      onClick={() => setCurrentlyTracking(false)}
                    >
                      {currentlyTracking === false && <Check className="w-4 h-4 mr-2" />}
                      No
                    </Button>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">
                      How often would you like to track?
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      We'll send helpful reminders
                    </p>
                  </div>
                  <div className="space-y-3">
                    {["daily", "weekly", "monthly"].map((freq) => (
                      <Button
                        key={freq}
                        variant={trackingFrequency === freq ? "default" : "outline"}
                        className="w-full h-14 rounded-xl text-base font-medium justify-between px-6"
                        onClick={() => setTrackingFrequency(freq)}
                      >
                        <span className="capitalize">{freq}</span>
                        {trackingFrequency === freq && <Check className="w-4 h-4" />}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="h-12 rounded-xl font-semibold"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 h-12 rounded-xl font-semibold"
            >
              {step === totalSteps ? "Get Started" : "Continue"}
              {step < totalSteps && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;