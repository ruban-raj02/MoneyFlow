import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Home,
  PieChart,
  Wallet,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  CreditCard,
  Plus,
  Info,
  ChevronRight,
  Trash2,
  Check,
  ChevronLeft,
  User,
  Mail,
  MessageSquare,
  Crown,
} from "lucide-react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";
import { useApp } from "@/contexts/AppContext";
import { format } from "date-fns";
import AddExpenseIncomeModal from "@/components/dashboard/AddExpenseIncomeModal";
import DeleteWalletDialog from "@/components/settings/DeleteWalletDialog";
import DeleteIncomeDialog from "@/components/settings/DeleteIncomeDialog";
import FeedbackModal from "@/components/settings/FeedbackModal";
import EraseDataDialog from "@/components/settings/EraseDataDialog";
import AddWalletModal from "@/components/wallets/AddWalletModal";
import { capitalizeWords } from "@/lib/capitalize";
import { WalletItem } from "@/pages/Wallets";
import { Transaction } from "@/contexts/AppContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

type SettingsTab = "general" | "wallets" | "income" | "pricing" | "about" | "account";

const Settings = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { wallets, transactions, addTransaction, addWallet, setWallets, deleteTransaction, eraseAllData } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addWalletModalOpen, setAddWalletModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab | null>(null);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [recurringIncomes, setRecurringIncomes] = useState<Record<string, boolean>>({});
  
  // Delete dialogs state
  const [deleteWalletDialogOpen, setDeleteWalletDialogOpen] = useState(false);
  const [walletToDelete, setWalletToDelete] = useState<WalletItem | null>(null);
  const [deleteIncomeDialogOpen, setDeleteIncomeDialogOpen] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState<Transaction | null>(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [eraseDialogOpen, setEraseDialogOpen] = useState(false);
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Don't auto-open any tab - wait for user to click

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Filter income by active wallet
  const activeWallet = wallets.find(w => w.isActive);
  const incomeTransactions = transactions.filter((t) => t.type === "income" && (!activeWallet || t.wallet_id === activeWallet.id));

  const handleSaveIncome = (data: {
    amount: number;
    date: Date;
    wallet: string;
    description: string;
    category: string;
    type: "expense" | "income";
  }) => {
    addTransaction({
      type: "income",
      category: data.category,
      amount: data.amount,
      description: data.description || data.category,
      date: data.date.toISOString(),
      wallet_id: data.wallet, // Associate with selected wallet
    });
  };

  const handleDeleteWalletClick = (wallet: WalletItem) => {
    setWalletToDelete(wallet);
    setDeleteWalletDialogOpen(true);
  };

  const handleConfirmDeleteWallet = () => {
    if (walletToDelete) {
      setWallets((prev) => prev.filter((w) => w.id !== walletToDelete.id));
      setDeleteWalletDialogOpen(false);
      setWalletToDelete(null);
    }
  };

  const handleSetActiveWallet = (id: string) => {
    setWallets((prev) =>
      prev.map((w) => ({
        ...w,
        isActive: w.id === id,
      }))
    );
  };

  const handleDeleteIncomeClick = (income: Transaction) => {
    setIncomeToDelete(income);
    setDeleteIncomeDialogOpen(true);
  };

  const handleConfirmDeleteIncome = () => {
    if (incomeToDelete) {
      deleteTransaction(incomeToDelete.id);
      setDeleteIncomeDialogOpen(false);
      setIncomeToDelete(null);
    }
  };

  const handleToggleRecurring = (id: string) => {
    setRecurringIncomes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEraseAllData = async () => {
    setIsErasing(true);
    try {
      await eraseAllData();
      toast.success("All data has been erased successfully");
      setEraseDialogOpen(false);
    } catch (error) {
      toast.error("Failed to erase data. Please try again.");
    } finally {
      setIsErasing(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const handleTabSelect = (tab: SettingsTab) => {
    if (tab === "pricing") {
      navigate("/pricing");
      return;
    }
    setActiveTab(tab);
  };

  const handleBackToTabs = () => {
    setActiveTab(null);
  };

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", active: false },
    { icon: PieChart, label: "Analytics", href: "/analytics", active: false },
    { icon: CreditCard, label: "Subscriptions", href: "/subscriptions", active: false },
    { icon: Wallet, label: "Wallets", href: "/wallets", active: false },
    { icon: Crown, label: "Pricing", href: "/pricing", active: false },
    { icon: SettingsIcon, label: "Settings", href: "/settings", active: true },
  ];

  const settingsTabs = [
    { id: "general" as SettingsTab, label: "General", icon: SettingsIcon },
    { id: "wallets" as SettingsTab, label: "Manage Wallets", icon: Wallet },
    { id: "income" as SettingsTab, label: "Manage Income", icon: CreditCard },
    { id: "pricing" as SettingsTab, label: "Subscribe to Pro", icon: Crown },
    { id: "about" as SettingsTab, label: "About", icon: Info },
    { id: "account" as SettingsTab, label: "Account", icon: LogOut },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Tab Content Header for both mobile and desktop
  const TabContentHeader = ({ title }: { title: string }) => (
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBackToTabs}
        className="text-muted-foreground hover:text-foreground h-9 w-9  "
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <h2 className="font-semibold text-lg">{title}</h2>
      <Button
        variant="ghost"
        size="icon"
        // onClick={handleBackToTabs}
        className="h-9 w-9 "
      >
        {/* <X className="w-4 h-4" /> */}
      </Button>
    </div>
  );

  // Tab Content Components
  const GeneralContent = () => (
    <Card className="p-4 sm:p-6 rounded-2xl border-border/50 transition-all duration-300 ease-out">
      {activeTab && <TabContentHeader title="General Settings" />}
      <div className="space-y-4 sm:space-y-6">
        {/* User Name */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 transition-all duration-200">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">Name</Label>
            <p className="font-medium">{user?.user_metadata?.full_name || user?.user_metadata?.name || "User"}</p>
          </div>
        </div>

        {/* User Email */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 transition-all duration-200">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">Email</Label>
            <p className="font-medium">{user?.email || "Not available"}</p>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 transition-all duration-200">
          <div>
            <Label>Theme</Label>
            <p className="text-sm text-muted-foreground">Toggle dark/light mode</p>
          </div>
          <ThemeToggle showLabel />
        </div>

        {/* Erase All Data */}
        <div className="pt-4 border-t border-border/50">
          <Button
            variant="destructive"
            onClick={() => setEraseDialogOpen(true)}
            className="w-full rounded-xl"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Erase All Data
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            This will permanently delete all your data
          </p>
        </div>
      </div>
    </Card>
  );

  const WalletsContent = () => (
    <Card className="p-4 sm:p-6 rounded-2xl border-border/50 transition-all duration-300 ease-out">
      {activeTab && <TabContentHeader title="Manage Wallets" />}
      <Button onClick={() => setAddWalletModalOpen(true)} className="w-full rounded-xl mb-4">
        <Plus className="w-4 h-4 mr-2" />
        Add Wallet
      </Button>
      <div className="space-y-3">
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            className="flex items-center gap-3 p-4 rounded-xl bg-secondary/30 dark:bg-secondary/20 transition-all duration-300 ease-out hover:bg-secondary/50"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{wallet.name}</p>
              <p className="text-xs text-muted-foreground">
                {wallet.currencySymbol} • {wallet.country}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {wallet.isActive ? (
                <span className="flex items-center gap-1 text-xs text-success font-medium">
                  <Check className="w-3 h-3" />
                  Active
                </span>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSetActiveWallet(wallet.id)}
                  className="text-xs h-8"
                >
                  Set Active
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteWalletClick(wallet)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {wallets.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No wallets added yet
          </div>
        )}
      </div>
    </Card>
  );

  const IncomeContent = () => (
    <Card className="p-4 sm:p-6 rounded-2xl border-border/50 transition-all duration-300 ease-out">
      {activeTab && <TabContentHeader title="Manage Income" />}
      <Button onClick={() => setIncomeModalOpen(true)} className="w-full rounded-xl mb-4">
        <Plus className="w-4 h-4 mr-2" />
        Add Income
      </Button>
      <div className="space-y-3">
        {incomeTransactions.map((income) => {
          const incomeWallet = wallets.find(w => w.id === income.wallet_id);
          const incomeCurrency = incomeWallet?.currency || activeWallet?.currency || "USD";
          return (
            <div
              key={income.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-secondary/30 dark:bg-secondary/20 transition-all duration-300 ease-out hover:bg-secondary/50"
            >
              {/* Top row: Icon + Details */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-success/20 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm capitalize">{income.category.replace("-", " ")}</p>
                  <p className="text-xs text-muted-foreground break-words">
                    {income.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(income.date), "MMM d, h:mm a")}
                  </p>
                </div>
                {/* Amount - always visible */}
                <span className="font-semibold text-sm text-success whitespace-nowrap">
                  +{formatCurrency(income.amount, incomeCurrency)}
                </span>
              </div>
            
            {/* Bottom row on mobile: Recurring + Delete */}
            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t border-border/30 sm:border-0">
              <div className="flex items-center gap-2">
                <Switch
                  id={`recurring-${income.id}`}
                  checked={recurringIncomes[income.id] || false}
                  onCheckedChange={() => handleToggleRecurring(income.id)}
                />
                <Label htmlFor={`recurring-${income.id}`} className="text-xs text-muted-foreground">
                  Recurring
                </Label>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteIncomeClick(income)}
                className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          );
        })}
        {incomeTransactions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No income added yet
          </div>
        )}
      </div>
    </Card>
  );

  const AboutContent = () => (
    <Card className="p-4 sm:p-6 rounded-2xl border-border/50 transition-all duration-300 ease-out">
      {activeTab && <TabContentHeader title="About" />}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">M</span>
          </div>
          <div>
            <h3 className="font-semibold text-lg">MoneyFlow</h3>
            <p className="text-sm text-muted-foreground">Version 1.0.0</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            MoneyFlow is a modern personal finance management application designed to help you
            track your income, expenses, and subscriptions with elegance.
          </p>

          <div className="space-y-2">
            <h4 className="font-medium">Features</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Multi-wallet support with different currencies</li>
              <li>• Track expenses and income</li>
              <li>• Subscription management</li>
              <li>• Beautiful analytics and insights</li>
              <li>• Dark and light theme support</li>
            </ul>
          </div>

          {/* Contact Developer Card */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Contact Developer</h4>
                <p className="text-xs text-muted-foreground">Get in touch with us</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              {/* Placeholder - user will fill details later */}
              <p>Email: programmer.ruban@gmail.com</p>
              <p>Twitter: @moneyflow</p>
              <p>Website: moneyflow.app</p>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">© 2025 MoneyFlow. All rights reserved.</p>
          </div>
        </div>
      </div>
    </Card>
  );

  const AccountContent = () => (
    <Card className="p-4 sm:p-6 rounded-2xl border-border/50 transition-all duration-300 ease-out">
      {activeTab && <TabContentHeader title="Account" />}
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
          <p className="text-sm text-muted-foreground">Sign out of MoneyFlow on this device.</p>
        </div>
        <Button variant="destructive" onClick={handleSignOut} className="w-full rounded-xl">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>Settings - MoneyFlow</title>
        <meta name="description" content="Manage your MoneyFlow settings, wallets, and income." />
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
              <ThemeToggle showLabel />
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Settings</h1>

            {/* Mobile: Show tabs list or tab content */}
            {isMobile ? (
              activeTab === null ? (
                // Show tab list
                <div className="space-y-2">
                  {settingsTabs.map((tab, index) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabSelect(tab.id)}
                      className="flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-300 ease-out w-full text-left bg-card border border-border/50 hover:bg-secondary/50 hover:scale-[1.01] animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center transition-transform duration-200">
                        <tab.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="flex-1 font-medium">{tab.label}</span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  ))}
                  
                  {/* Send Feedback Button */}
                  <button
                    onClick={() => setFeedbackModalOpen(true)}
                    className="flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-300 ease-out w-full text-left bg-card border border-border/50 hover:bg-secondary/50 hover:scale-[1.01] animate-fade-in"
                    style={{ animationDelay: `${settingsTabs.length * 50}ms` }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center transition-transform duration-200">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <span className="flex-1 font-medium">Send Feedback</span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform duration-200" />
                  </button>

                </div>
              ) : (
                // Show tab content
                <div className="animate-fade-in">
                  {activeTab === "general" && <GeneralContent />}
                  {activeTab === "wallets" && <WalletsContent />}
                  {activeTab === "income" && <IncomeContent />}
                  {activeTab === "about" && <AboutContent />}
                  {activeTab === "account" && <AccountContent />}
                </div>
              )
            ) : (
              // Desktop: Show sidebar and content
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Settings Sidebar/Tabs */}
                <div className="lg:w-56 space-y-1">
                  {settingsTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabSelect(tab.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full text-left ${
                        activeTab === tab.id
                          ? "bg-secondary font-medium"
                          : "text-muted-foreground hover:bg-secondary/50"
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      {tab.label}
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </button>
                  ))}
                  
                  {/* Send Feedback Button */}
                  <button
                    onClick={() => setFeedbackModalOpen(true)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full text-left text-muted-foreground hover:bg-secondary/50"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Send Feedback
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1">
                  {activeTab === null && (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      Select a setting from the left to get started
                    </div>
                  )}
                  {activeTab === "general" && <GeneralContent />}
                  {activeTab === "wallets" && <WalletsContent />}
                  {activeTab === "income" && <IncomeContent />}
                  {activeTab === "about" && <AboutContent />}
                  {activeTab === "account" && <AccountContent />}
                </div>
              </div>
            )}
          </div>
        </main>

        <AddExpenseIncomeModal
          isOpen={incomeModalOpen}
          onClose={() => setIncomeModalOpen(false)}
          onSave={handleSaveIncome}
          type="income"
        />

        <DeleteWalletDialog
          isOpen={deleteWalletDialogOpen}
          onClose={() => {
            setDeleteWalletDialogOpen(false);
            setWalletToDelete(null);
          }}
          onConfirm={handleConfirmDeleteWallet}
          wallet={walletToDelete}
        />

        <DeleteIncomeDialog
          isOpen={deleteIncomeDialogOpen}
          onClose={() => {
            setDeleteIncomeDialogOpen(false);
            setIncomeToDelete(null);
          }}
          onConfirm={handleConfirmDeleteIncome}
          income={incomeToDelete}
          currency={incomeToDelete ? (wallets.find(w => w.id === incomeToDelete.wallet_id)?.currency || activeWallet?.currency || "USD") : "USD"}
        />

        <FeedbackModal
          isOpen={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          userEmail={user?.email}
        />

        <EraseDataDialog
          isOpen={eraseDialogOpen}
          onClose={() => setEraseDialogOpen(false)}
          onConfirm={handleEraseAllData}
          isDeleting={isErasing}
        />

        <AddWalletModal
          isOpen={addWalletModalOpen}
          onClose={() => setAddWalletModalOpen(false)}
          onSave={addWallet}
        />
      </div>
    </>
  );
};

export default Settings;