import { Wallet, BarChart3, Shield } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Multi-Wallet Support",
    description: "Manage multiple accounts, subscriptions, and wallets all in one place. Seamless sync across all your financial sources.",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: BarChart3,
    title: "Beautiful Analytics",
    description: "Stunning visualizations that make understanding your spending patterns a delight. Interactive charts and smart insights.",
    gradient: "from-success/20 to-success/5",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Bank-grade encryption protects your data. Your financial information stays private and secure, always.",
    gradient: "from-chart-4/20 to-chart-4/5",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="pt-0 pb-2 md:py-28 relative">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Everything you need to
            <br />
            <span className="text-muted-foreground">take control</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed with simplicity in mind. 
            Experience finance management that just works.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-full rounded-3xl bg-card border border-border p-8 transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                    <feature.icon className="w-7 h-7 text-foreground" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;