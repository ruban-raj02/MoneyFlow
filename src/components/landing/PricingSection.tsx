import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// SVG Icons for ChatGPT and Razorpay
const ChatGPTIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
  </svg>
);

const RazorpayIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M7.755 3h12.308L14.32 21H2L7.755 3zm5.18 1.625H9.008l-3.614 14.75h3.927l3.614-14.75zm6.428 0h-3.927l-2.23 9.106 1.662 5.644h3.927l.568-14.75z"/>
  </svg>
);

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);

  const freeFeatures = [
    "Unlimited Expense Tracking",
    "Access dashboard & reports",
    "3x Wallets",
    "2x Income sources",
    "3x Subscriptions",
  ];

  const proFeatures = [
    "Unlimited Expense/Income Tracking",
    "Unlimited Wallets",
    "Unlimited Income sources",
    "Unlimited Subscriptions",
    "Advanced AI analytics & reports",
    "Advance Early Payment Reminders",
    "Import & Export CSV/JSON",
  ];

  const pricing = {
    monthly: { inr: "₹199", usd: "$9" },
    yearly: { inr: "₹2,199", usd: "$96" },
  };

  return (
    <section id="pricing" className="pt-2 sm:pt-2 pb-20 sm:pb-32 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Powered by section - moved above pricing */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16 sm:mb-20 mt-12 sm:mt-2">
          <span className="text-base sm:text-lg text-muted-foreground font-semibold">Powered by</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-secondary/50 border border-border/50">
              <ChatGPTIcon />
              <span className="text-base sm:text-lg font-medium">ChatGPT</span>
            </div>
            <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-secondary/50 border border-border/50">
              <RazorpayIcon />
              <span className="text-base sm:text-lg font-medium">Razorpay</span>
            </div>
          </div>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-sm text-muted-foreground mb-6 font-semibold">
            <Sparkles className="w-4 h-4" />
            Simple Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Choose your plan
          </h2>
          <p className="text-muted-foreground text-lg">
            Start free, upgrade when you need more. Cancel anytime.
          </p>

          {/* Toggle - Fixed contained design */}
          <div className="flex items-center justify-center mt-8">
            <div className="inline-flex items-center p-1 rounded-full bg-secondary border border-border">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  !isYearly 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                  isYearly 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Yearly
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isYearly 
                    ? "bg-primary-foreground/20 text-primary-foreground" 
                    : "bg-success/20 text-success"
                }`}>
                  -8%
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="p-6 sm:p-8 rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <p className="text-muted-foreground text-sm">Perfect to get started</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-semibold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>

            <Link to="/auth">
              <Button variant="outline" className="w-full mb-8 rounded-xl font-semibold">
                Get Started
              </Button>
            </Link>

            <ul className="space-y-3">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Pro Plan */}
          <Card className="p-6 sm:p-8 rounded-2xl border-primary/50 bg-gradient-to-b from-primary/5 to-card/50 backdrop-blur-sm relative transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            {isYearly && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-success text-success-foreground text-xs font-medium">
                Best Value
              </div>
            )}
            {!isYearly && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                Most Popular
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="text-muted-foreground text-sm">For power users</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-semibold">
                  {isYearly ? pricing.yearly.usd : pricing.monthly.usd}
                </span>
                <span className="text-muted-foreground">/{isYearly ? "year" : "month"}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                or {isYearly ? pricing.yearly.inr : pricing.monthly.inr} INR
              </p>
            </div>

            <Link to="/auth">
              <Button className="w-full mb-8 rounded-xl font-semibold">
                Upgrade to Pro
              </Button>
            </Link>

            <ul className="space-y-3">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <p className="text-xs text-muted-foreground text-center mt-6">
              Cancel anytime. No questions asked.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
