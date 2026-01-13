import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet";
import ThemeToggle from "@/components/ThemeToggle";

const Pricing = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);

  const freeFeatures = [
    "Unlimited Expense Tracking",
    "Access Dashboard & Reports",
    "3x Wallets",
    "2x Income sources",
    "5x Subscriptions",
  ];

  const proFeatures = [
    "Unlimited Wallets",
    "Unlimited Subscriptions",
    "Unlimited Income & Expenses",
    "Advanced AI analytics & reports",
    "Early Payment Reminders",
    "Import & Export CSV/JSON",
  ];

  const pricing = {
    monthly: { inr: "₹199", usd: "$9" },
    yearly: { inr: "₹2,199", usd: "$96" },
  };

  return (
    <>
      <Helmet>
        <title>Pricing - MoneyFlow</title>
        <meta name="description" content="Choose a plan that works for you. Start free, upgrade when you need more." />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="rounded-full"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Link to="/" className="flex items-center gap-2">
                  <span className="text-xl font-semibold tracking-tight">
                    Money<span className="text-primary">Flow</span>
                  </span>
                </Link>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-sm text-muted-foreground mb-6 font-semibold">
                <Sparkles className="w-4 h-4"/>
                Simple Pricing
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">
                Choose your plan
              </h1>
              <p className="text-muted-foreground text-lg">
                Start free, upgrade when you need more. Cancel anytime.
              </p>

              {/* Toggle - Button style like landing page */}
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
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  {isYearly ? "Best Value" : "Most Popular"}
                </div>

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
        </main>
      </div>
    </>
  );
};

export default Pricing;
