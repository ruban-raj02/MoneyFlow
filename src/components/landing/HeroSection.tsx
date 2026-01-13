import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-[100dvh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Floating gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Badge */}
          <div className="relative inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-secondary border border-border text-xs sm:text-sm text-muted-foreground animate-fade-in max-sm:-top-12 sm:top-0">
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-success animate-pulse shrink-0" />
            <span className="whitespace-nowrap">Your finances, reimagined</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[1.1] animate-slide-up px-2">
            Master Money
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              with Elegance
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up px-4" style={{ animationDelay: '0.1s' }}>
            Track every penny with precision. Beautiful analytics, multi-wallet support, 
            and bank-grade security — all in one seamless experience.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 animate-slide-up px-4" style={{ animationDelay: '0.2s' }}>
            <Link to="/auth" className="w-full sm:w-auto">
              <Button variant="hero" size="lg" className="w-full sm:min-w-[180px] group">
                Get Started
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#features" className="w-full sm:w-auto">
              <Button variant="heroOutline" size="lg" className="w-full sm:min-w-[180px]">
                Learn More
              </Button>
            </a>
          </div>

          {/* Stats preview */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 pt-12 sm:pt-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground">10k+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="w-px h-10 sm:h-12 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground">$2.5M</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Tracked</div>
            </div>
            <div className="w-px h-10 sm:h-12 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground">4.9★</div>
              <div className="text-xs sm:text-sm text-muted-foreground">App Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;