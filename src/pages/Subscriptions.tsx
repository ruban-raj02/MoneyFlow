import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Tv,
  Music,
  Cloud,
  Dumbbell,
  Gamepad2,
  Mail,
  Shield,
  Book,
  Eye,
  Pencil,
  Trash2,
  Crown,
} from "lucide-react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";
import AddSubscriptionModal from "@/components/subscriptions/AddSubscriptionModal";
import { differenceInDays, format } from "date-fns";
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";

/* ================= TYPES ================= */

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  nextRenewal: string;
  frequency: "monthly" | "yearly" | "weekly";
  icon: string;
  description?: string;
  wallet_id?: string;
}

/* ================= ICON MAP ================= */

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  tv: Tv,
  music: Music,
  cloud: Cloud,
  gym: Dumbbell,
  gaming: Gamepad2,
  mail: Mail,
  security: Shield,
  book: Book,
  default: CreditCard,
};

/* ================= COMPONENT ================= */

const Subscriptions = () => {
  const { user, signOut } = useAuth();
  const { activeWallet, wallets } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (user && activeWallet) {
      fetchSubscriptions();
    }
  }, [user, activeWallet]);

  const fetchSubscriptions = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mapped: Subscription[] = (data || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        amount: Number(s.amount),
        currency: s.currency || "USD",
        nextRenewal: s.next_billing_date,
        frequency: s.billing_cycle,
        icon: s.category || "default",
        description: s.name,
        wallet_id: s.wallet_id,
      }));

      setSubscriptions(mapped);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */

  const filteredSubscriptions = activeWallet
    ? subscriptions.filter((s) => s.wallet_id === activeWallet.id)
    : subscriptions;

  /* ================= ACTIONS ================= */

  const handleSignOut = async () => {
    await signOut();
  };

  const handleAddSubscription = async (sub: Omit<Subscription, "id">) => {
    if (!user || !activeWallet) return;

    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .insert({
          user_id: user.id,
          name: sub.name,
          amount: sub.amount,
          currency: sub.currency,
          billing_cycle: sub.frequency,
          next_billing_date: sub.nextRenewal,
          category: sub.icon,
          wallet_id: activeWallet.id,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      setSubscriptions((prev: Subscription[]) => [
        {
          id: data.id,
          name: data.name,
          amount: Number(data.amount), // ensure number
          currency: data.currency ?? "USD",
          nextRenewal: data.next_billing_date,
          frequency: data.billing_cycle as "monthly" | "yearly" | "weekly", // 🔥 FIX
          icon: data.category ?? "default",
          description: data.name,
          wallet_id: data.wallet_id,
        },
        ...prev,
      ]);
      

      toast.success("Subscription added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add subscription");
    }
  };

  const handleEditSubscription = async (sub: Omit<Subscription, "id">) => {
    if (!user || !selectedSubscription) return;

    try {
      const { error } = await supabase
        .from("subscriptions")
        .update({
          name: sub.name,
          amount: sub.amount,
          currency: sub.currency,
          billing_cycle: sub.frequency,
          next_billing_date: sub.nextRenewal,
          category: sub.icon,
        })
        .eq("id", selectedSubscription.id)
        .eq("user_id", user.id);

      if (error) throw error;

      setSubscriptions((prev) =>
        prev.map((s) =>
          s.id === selectedSubscription.id ? { ...s, ...sub } : s
        )
      );

      toast.success("Subscription updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update subscription");
    } finally {
      setEditModalOpen(false);
      setSelectedSubscription(null);
    }
  };

  const handleDeleteSubscription = async () => {
    if (!user || !selectedSubscription) return;

    try {
      const { error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("id", selectedSubscription.id)
        .eq("user_id", user.id);

      if (error) throw error;

      setSubscriptions((prev) =>
        prev.filter((s) => s.id !== selectedSubscription.id)
      );

      toast.success("Subscription deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete subscription");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedSubscription(null);
    }
  };

  /* ================= HELPERS ================= */

  const formatAmount = (amount: number, walletId?: string) => {
    const wallet = wallets.find((w) => w.id === walletId) || activeWallet;
    return `${wallet?.currencySymbol || "$"}${amount.toFixed(2)}`;
  };

  const getFrequencyLabel = (f: string) =>
    f === "weekly" ? "/wk" : f === "yearly" ? "/yr" : "/mo";

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", active: false },
    { icon: PieChart, label: "Analytics", href: "/analytics", active: false },
    { icon: CreditCard, label: "Subscriptions", href: "/subscriptions", active: true },
    { icon: Wallet, label: "Wallets", href: "/wallets", active: false },
    { icon: Crown, label: "Pricing", href: "/pricing", active: false },
    { icon: Settings, label: "Settings", href: "/settings", active: false },
  ];

  /* ================= UI (YOUR FULL UI) ================= */

  return (
    <>
      <Helmet>
        <title>Subscriptions - MoneyFlow</title>
        <meta name="description" content="Manage your recurring subscriptions." />
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h1 className="text-2xl font-semibold">Subscriptions</h1>
              <Button onClick={() => setAddModalOpen(true)} className="rounded-xl w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Subscription
              </Button>
            </div>

            {/* Subscription Cards */}
            <div className="grid gap-4">
              {filteredSubscriptions.map((sub) => {
                const Icon = iconMap[sub.icon] || iconMap.default;
                const daysUntil = differenceInDays(new Date(sub.nextRenewal), new Date());

                return (
                  <Card key={sub.id} className="p-4 rounded-2xl border-border/50">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{sub.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Renews in {Math.abs(daysUntil)} days
                          </p>
                        </div>
                        <div className="text-right shrink-0 sm:hidden">
                          <p className="font-semibold">
                            {formatAmount(sub.amount, sub.wallet_id)}
                            <span className="text-sm text-muted-foreground font-normal">
                              {getFrequencyLabel(sub.frequency)}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2">
                        <div className="text-right shrink-0 hidden sm:block">
                          <p className="font-semibold">
                            {formatAmount(sub.amount, sub.wallet_id)}
                            <span className="text-sm text-muted-foreground font-normal">
                              {getFrequencyLabel(sub.frequency)}
                            </span>
                          </p>
                        </div>
                        {/* Action buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedSubscription(sub);
                              setViewModalOpen(true);
                            }}
                            className="h-8 w-8"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedSubscription(sub);
                              setEditModalOpen(true);
                            }}
                            className="h-8 w-8"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedSubscription(sub);
                              setDeleteDialogOpen(true);
                            }}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}

              {filteredSubscriptions.length === 0 && (
                <Card className="p-8 rounded-2xl border-border/50 text-center">
                  <p className="text-muted-foreground">No subscriptions yet</p>
                  <Button onClick={() => setAddModalOpen(true)} className="mt-4 rounded-xl">
                    Add your first subscription
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </main>

        <AddSubscriptionModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSave={handleAddSubscription}
        />

        <AddSubscriptionModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedSubscription(null);
          }}
          onSave={handleEditSubscription}
          editSubscription={selectedSubscription}
        />

        {/* View Modal */}
        <Dialog open={viewModalOpen} onOpenChange={() => {
          setViewModalOpen(false);
          setSelectedSubscription(null);
        }}>
          <DialogContent className="p-0 gap-0 overflow-hidden [&>button]:hidden rounded-2xl max-w-[calc(100%-2rem)] sm:max-w-sm mx-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-popover">
              <div className="w-16" />
              <h3 className="font-semibold text-base">Subscription Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setViewModalOpen(false);
                  setSelectedSubscription(null);
                }}
                className="text-primary hover:text-primary font-semibold h-9 px-3"
              >
                Close
              </Button>
            </div>
            {selectedSubscription && (
              <div className="p-4">
                <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-sm text-muted-foreground shrink-0">Name</span>
                    <span className="text-sm font-medium text-right break-words">{selectedSubscription.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="text-sm font-semibold">
                      {formatAmount(selectedSubscription.amount, selectedSubscription.wallet_id)}
                      {getFrequencyLabel(selectedSubscription.frequency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Frequency</span>
                    <span className="text-sm font-medium capitalize">{selectedSubscription.frequency}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Next Renewal</span>
                    <span className="text-sm font-medium">
                      {format(new Date(selectedSubscription.nextRenewal), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={() => {
          setDeleteDialogOpen(false);
          setSelectedSubscription(null);
        }}>
          <AlertDialogContent className="p-0 gap-0 overflow-hidden [&>button]:hidden rounded-2xl max-w-[calc(100%-2rem)] sm:max-w-sm mx-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-popover">
              <AlertDialogCancel className="text-muted-foreground hover:text-foreground font-semibold h-9 px-3 border-0 bg-transparent">
                Cancel
              </AlertDialogCancel>
              <h3 className="font-semibold text-base">Delete Subscription</h3>
              <AlertDialogAction
                onClick={handleDeleteSubscription}
                className="text-destructive hover:text-destructive font-semibold h-9 px-3 bg-transparent hover:bg-transparent"
              >
                Delete
              </AlertDialogAction>
            </div>
            {selectedSubscription && (
              <div className="p-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Are you sure you want to delete this subscription?
                </p>
                <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-sm text-muted-foreground shrink-0">Name</span>
                    <span className="text-sm font-medium text-right break-words">{selectedSubscription.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="text-sm font-semibold">
                      {formatAmount(selectedSubscription.amount, selectedSubscription.wallet_id)}
                      {getFrequencyLabel(selectedSubscription.frequency)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default Subscriptions;
