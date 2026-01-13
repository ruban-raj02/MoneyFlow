import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  TrendingUp,
  Sparkles,
  Crown,
} from "lucide-react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";
import OverallSpendingCard from "@/components/dashboard/OverallSpendingCard";
import QuickStatsCard from "@/components/dashboard/QuickStatsCard";
import UpcomingSubscriptionsCard from "@/components/dashboard/UpcomingSubscriptionsCard";
import QuickAddCard from "@/components/dashboard/QuickAddCard";
import QuickAddModal from "@/components/dashboard/QuickAddModal";
import AddExpenseIncomeModal from "@/components/dashboard/AddExpenseIncomeModal";
import RecentTransactionsCard from "@/components/dashboard/RecentTransactionsCard";
import { useApp } from "@/contexts/AppContext";
import { format, isToday, isThisWeek, isThisMonth } from "date-fns";

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { transactions, addTransaction, updateTransaction, deleteTransaction, wallets } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickAddModalOpen, setQuickAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleQuickAdd = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setQuickAddModalOpen(true);
  };

  const handleSaveQuickAdd = (data: {
    amount: number;
    date: Date;
    wallet: string;
    description: string;
    category: string;
  }) => {
    addTransaction({
      type: "expense",
      category: data.category,
      amount: data.amount,
      description: data.description || data.category.replace("-", " "),
      date: data.date.toISOString(),
      wallet_id: data.wallet, // Associate with selected wallet
    });
  };

  const handleSaveExpenseIncome = (data: {
    amount: number;
    date: Date;
    wallet: string;
    description: string;
    category: string;
    type: "expense" | "income";
  }) => {
    addTransaction({
      type: data.type,
      category: data.category,
      amount: data.amount,
      description: data.description || data.category.replace("-", " "),
      date: data.date.toISOString(),
      wallet_id: data.wallet, // Associate with selected wallet
    });
  };

  // Get active wallet
  const activeWallet = wallets.find(w => w.isActive);
  
  // Filter transactions by active wallet
  const walletTransactions = activeWallet 
    ? transactions.filter((t) => t.wallet_id === activeWallet.id)
    : transactions;

  // Calculate stats based on wallet-specific transactions
  const expenses = walletTransactions.filter((t) => t.type === "expense");
  const incomes = walletTransactions.filter((t) => t.type === "income");
  
  const monthlyExpenses = expenses.filter((t) => isThisMonth(new Date(t.date)));
  const monthlyIncomes = incomes.filter((t) => isThisMonth(new Date(t.date)));
  
  const totalSpending = monthlyExpenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = monthlyIncomes.reduce((sum, t) => sum + t.amount, 0);
  
  const todaySpending = expenses
    .filter((t) => isToday(new Date(t.date)))
    .reduce((sum, t) => sum + t.amount, 0);
  
  const weekSpending = expenses
    .filter((t) => isThisWeek(new Date(t.date)))
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthSpending = monthlyExpenses.reduce((sum, t) => sum + t.amount, 0);

  const currentMonth = format(new Date(), "MMMM");
  const currencySymbol = activeWallet?.currencySymbol || "$";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - MoneyFlow</title>
        <meta name="description" content="Track your income and expenses with MoneyFlow dashboard." />
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
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium transition-all duration-300 ease-out"
            >
              <Home className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              to="/analytics"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary transition-all duration-300 ease-out"
            >
              <PieChart className="w-5 h-5" />
              Analytics
            </Link>
            <Link
              to="/subscriptions"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary transition-all duration-300 ease-out"
            >
              <CreditCard className="w-5 h-5" />
              Subscriptions
            </Link>
            <Link
              to="/wallets"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary transition-all duration-300 ease-out"
            >
              <Wallet className="w-5 h-5" />
              Wallets
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary transition-all duration-300 ease-out"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
            <Link
              to="/pricing"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary transition-all duration-300 ease-out"
            >
              <Crown className="w-5 h-5" />
              Pricing
            </Link>
          </nav>

          <div className="space-y-2">
            <div className="px-4 py-3">
              <ThemeToggle showLabel />
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary transition-all duration-300 ease-out w-full"
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

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border shadow-lg animate-fade-in">
              <div className="p-4 space-y-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  Dashboard
                </Link>
                <Link
                  to="/analytics"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <PieChart className="w-5 h-5" />
                  Analytics
                </Link>
                <Link
                  to="/subscriptions"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <CreditCard className="w-5 h-5" />
                  Subscriptions
                </Link>
                <Link
                  to="/wallets"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Wallet className="w-5 h-5" />
                  Wallets
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </Link>
                <Link
                  to="/pricing"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Crown className="w-5 h-5" />
                  Pricing
                </Link>
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

        {/* Main content */}
        <main className="flex-1 p-4 pt-20 lg:pt-6 lg:p-8 overflow-x-hidden overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Overall Spending Card */}
            <OverallSpendingCard
              totalSpending={totalSpending}
              totalIncome={totalIncome}
              month={currentMonth}
              currencySymbol={currencySymbol}
            />

            {/* Add Expense / Income Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setExpenseModalOpen(true)}
                className="flex-1 rounded-xl h-14 text-base font-medium transition-all duration-300 ease-out hover:scale-[1.02] gap-2"
                variant="default"
              >
                <Plus className="w-5 h-5 shrink-0" />
                <span>Add Expense</span>
              </Button>
              <Button
                onClick={() => setIncomeModalOpen(true)}
                className="flex-1 rounded-xl h-14 text-base font-medium transition-all duration-300 ease-out hover:scale-[1.02] gap-2 border-primary/20 bg-popover"
                variant="outline"
              >
                <TrendingUp className="w-5 h-5 shrink-0" />
                <span>Add Income</span>
              </Button>
            </div>

            {/* Quick Stats Card */}
            <QuickStatsCard
              todaySpending={todaySpending}
              weekSpending={weekSpending}
              monthSpending={monthSpending}
              currencySymbol={currencySymbol}
            />

            {/* Upcoming Subscriptions */}
            <UpcomingSubscriptionsCard currencySymbol={currencySymbol} />

            {/* Quick Add */}
            <QuickAddCard onQuickAdd={handleQuickAdd} />

            {/* Recent Transactions - show wallet-specific transactions */}
            <RecentTransactionsCard 
              transactions={walletTransactions} 
              currencySymbol={currencySymbol}
              onUpdate={updateTransaction}
              onDelete={deleteTransaction}
            />
          </div>
        </main>

        {/* Quick Add Modal */}
        <QuickAddModal
          isOpen={quickAddModalOpen}
          onClose={() => setQuickAddModalOpen(false)}
          onSave={handleSaveQuickAdd}
          category={selectedCategory}
          currencySymbol={currencySymbol}
        />

        {/* Add Expense Modal */}
        <AddExpenseIncomeModal
          isOpen={expenseModalOpen}
          onClose={() => setExpenseModalOpen(false)}
          onSave={handleSaveExpenseIncome}
          type="expense"
        />

        {/* Add Income Modal */}
        <AddExpenseIncomeModal
          isOpen={incomeModalOpen}
          onClose={() => setIncomeModalOpen(false)}
          onSave={handleSaveExpenseIncome}
          type="income"
        />
      </div>
    </>
  );
};

export default Dashboard;
