import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  PieChart,
  Wallet,
  Settings,
  LogOut,
  Menu,
  X,
  CreditCard,
  Plus,
  Crown,
} from "lucide-react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";
import AddWalletModal from "@/components/wallets/AddWalletModal";
import { useApp, WalletItem } from "@/contexts/AppContext";

const Wallets = () => {
  const { signOut } = useAuth();
  const { wallets, addWallet, setWallets } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleAddWallet = (wallet: Omit<WalletItem, "id">) => {
    addWallet(wallet);
  };

  const toggleWalletActive = (walletId: string) => {
    setWallets(
      wallets.map((w) => ({
        ...w,
        isActive: w.id === walletId,
      }))
    );
  };

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", active: false },
    { icon: PieChart, label: "Analytics", href: "/analytics", active: false },
    { icon: CreditCard, label: "Subscriptions", href: "/subscriptions", active: false },
    { icon: Wallet, label: "Wallets", href: "/wallets", active: true },
    { icon: Crown, label: "Pricing", href: "/pricing", active: false },
    { icon: Settings, label: "Settings", href: "/settings", active: false },
  ];

  return (
    <>
      <Helmet>
        <title>Wallets - MoneyFlow</title>
        <meta name="description" content="Manage your wallets and currencies." />
      </Helmet>
      <div className="min-h-screen bg-background flex">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-card border-r border-border p-6 hidden lg:flex flex-col">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <span className="text-xl font-semibold tracking-tight">
              Money<span className="text-primary">Flow</span>
            </span>
          </Link>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  item.active
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="space-y-2">
            <div className="px-4 py-3">
              <ThemeToggle />
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between px-4 h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-lg font-semibold tracking-tight">
                Money<span className="text-primary">Flow</span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-full"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border shadow-lg animate-fade-in">
              <div className="p-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      item.active
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 pt-20 lg:pt-6 lg:p-8 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Wallets</h1>
              <Button onClick={() => setAddModalOpen(true)} className="rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Add Wallet
              </Button>
            </div>

            {/* Info text about deleting wallets */}
            <p className="text-sm text-muted-foreground">
              To remove a wallet, go to Settings → Manage Wallets → select and delete the wallet.
            </p>

            {/* Wallet Cards */}
            <div className="grid gap-4">
              {wallets.map((wallet) => (
                <Card
                  key={wallet.id}
                  className={`p-4 rounded-2xl border-border/50 cursor-pointer transition-all ${
                    wallet.isActive ? "ring-2 ring-primary" : "hover:bg-secondary/30"
                  }`}
                  onClick={() => toggleWalletActive(wallet.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{wallet.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {wallet.isActive ? (
                          <Badge variant="default" className="text-xs">Active</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Inactive</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        {wallet.currency}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {wallet.country}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}

              {wallets.length === 0 && (
                <Card className="p-8 rounded-2xl border-border/50 text-center">
                  <p className="text-muted-foreground">No wallets yet</p>
                  <Button onClick={() => setAddModalOpen(true)} className="mt-4 rounded-xl">
                    Add your first wallet
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </main>

        <AddWalletModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSave={handleAddWallet}
        />
      </div>
    </>
  );
};

export type { WalletItem };
export default Wallets;
