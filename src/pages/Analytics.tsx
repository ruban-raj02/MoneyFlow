import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Home,
  PieChart,
  Wallet,
  Settings,
  LogOut,
  Menu,
  X,
  CreditCard,
  TrendingUp,
  Calendar,
  DollarSign,
  Crown,
  Download,
  Upload,
} from "lucide-react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";
import RecentTransactionsCard from "@/components/dashboard/RecentTransactionsCard";
import { useApp } from "@/contexts/AppContext";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart as RechartsPieChart, Pie, Cell, CartesianGrid } from "recharts";
import { format, isThisMonth, parseISO, getHours } from "date-fns";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary))",
];

const Analytics = () => {
  const { signOut } = useAuth();
  const { transactions, addTransaction, updateTransaction, deleteTransaction, wallets } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [exportOpen, setExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");

  const [importOpen, setImportOpen] = useState(false);
  const [importFormat, setImportFormat] = useState<"csv" | "json">("csv");
  const [importFile, setImportFile] = useState<File | null>(null);

  const handleSignOut = async () => {
    await signOut();
  };

  const activeWallet = wallets.find(w => w.isActive);
  const currency = activeWallet?.currency || "USD";
  const currencySymbol = activeWallet?.currencySymbol || "$";

  // Filter transactions by active wallet
  const walletTransactions = useMemo(
    () => activeWallet 
      ? transactions.filter((t) => t.wallet_id === activeWallet.id)
      : transactions,
    [transactions, activeWallet]
  );

  const expenses = useMemo(
    () => walletTransactions.filter((t) => t.type === "expense" && isThisMonth(parseISO(t.date))),
    [walletTransactions],
  );

  const totalSpent = useMemo(() => expenses.reduce((sum, t) => sum + t.amount, 0), [expenses]);
  const daysInMonth = 30;
  const avgPerDay = totalSpent / daysInMonth;
  const highestSpend = expenses.length > 0 ? Math.max(...expenses.map((t) => t.amount)) : 0;

  // Top category
  const categoryTotals = useMemo(
    () =>
      expenses.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>),
    [expenses],
  );

  const topCategory = useMemo(() => Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0], [categoryTotals]);

  // Spending trend data
  const spendingByDate = useMemo(
    () =>
      expenses.reduce((acc, t) => {
        const dateKey = format(parseISO(t.date), "d MMM");
        acc[dateKey] = (acc[dateKey] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>),
    [expenses],
  );

  const trendData = useMemo(
    () =>
      Object.entries(spendingByDate)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => {
          const dateA = new Date(a.date + " 2024");
          const dateB = new Date(b.date + " 2024");
          return dateA.getTime() - dateB.getTime();
        }),
    [spendingByDate],
  );

  // Category breakdown data
  const pieData = useMemo(
    () =>
      Object.entries(categoryTotals).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1).replace("-", " "),
        value,
      })),
    [categoryTotals],
  );

  // Time of day spending
  const timeOfDay = useMemo(() => {
    const buckets = { morning: 0, afternoon: 0, evening: 0, night: 0 };
    expenses.forEach((t) => {
      const hour = getHours(parseISO(t.date));
      if (hour >= 5 && hour < 12) buckets.morning += t.amount;
      else if (hour >= 12 && hour < 17) buckets.afternoon += t.amount;
      else if (hour >= 17 && hour < 21) buckets.evening += t.amount;
      else buckets.night += t.amount;
    });
    return buckets;
  }, [expenses]);

  const totalTimeOfDay = Object.values(timeOfDay).reduce((a, b) => a + b, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const buildExportRows = () => {
    return transactions.map((t) => ({
      id: t.id,
      type: t.type,
      category: t.category,
      amount: t.amount,
      description: t.description || "",
      date: t.date,
      wallet_id: t.wallet_id || "",
    }));
  };

  const downloadExport = (formatToExport: "csv" | "json") => {
    const rows = buildExportRows();
    const dateStr = format(new Date(), "yyyy-MM-dd");

    if (formatToExport === "json") {
      const jsonData = JSON.stringify(rows, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `moneyflow-export-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }

    const headers = ["ID", "Type", "Category", "Amount", "Description", "Date", "Wallet ID"];
    const csvRows = [
      headers.join(","),
      ...rows.map((row) =>
        [
          row.id,
          row.type,
          row.category,
          row.amount,
          `"${String(row.description).replace(/"/g, '""')}"`,
          row.date,
          row.wallet_id,
        ].join(","),
      ),
    ];

    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `moneyflow-export-${dateStr}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const parseCsv = (text: string) => {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return [];

    // very small CSV parser (handles quoted fields)
    const parseLine = (line: string) => {
      const out: string[] = [];
      let cur = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') {
            cur += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
          continue;
        }
        if (ch === "," && !inQuotes) {
          out.push(cur);
          cur = "";
          continue;
        }
        cur += ch;
      }
      out.push(cur);
      return out;
    };

    const header = parseLine(lines[0]).map((h) => h.trim().toLowerCase());
    const idx = (key: string) => header.indexOf(key);

    return lines.slice(1).map((line) => {
      const cols = parseLine(line);
      return {
        id: cols[idx("id")] || "",
        type: (cols[idx("type")] || "").trim(),
        category: (cols[idx("category")] || "").trim(),
        amount: Number(cols[idx("amount")]),
        description: cols[idx("description")] || "",
        date: cols[idx("date")] || "",
        wallet_id: cols[idx("wallet id")] || cols[idx("wallet_id")] || "",
      };
    });
  };

  const handleImport = async () => {
    if (!importFile) {
      toast.error("Choose a file to import");
      return;
    }

    try {
      const text = await importFile.text();
      const rows =
        importFormat === "json"
          ? (JSON.parse(text) as any[])
          : parseCsv(text);

      const normalized = (rows || []).map((r) => ({
        type: r.type,
        category: r.category,
        amount: Number(r.amount),
        description: r.description ?? "",
        date: r.date,
        wallet_id: r.wallet_id || undefined,
      }));

      const valid = normalized.filter(
        (r) =>
          (r.type === "expense" || r.type === "income") &&
          typeof r.category === "string" &&
          r.category.length > 0 &&
          Number.isFinite(r.amount) &&
          r.amount > 0 &&
          typeof r.date === "string" &&
          r.date.length > 0,
      );

      if (valid.length === 0) {
        toast.error("No valid rows found to import");
        return;
      }

      for (const r of valid) {
        await addTransaction({
          type: r.type,
          category: r.category,
          amount: r.amount,
          description: String(r.description || r.category),
          date: r.date,
          wallet_id: r.wallet_id,
        });
      }

      toast.success(`Imported ${valid.length} transactions`);
      setImportFile(null);
      setImportOpen(false);
    } catch (e) {
      toast.error("Import failed. Please check the file format.");
      console.error(e);
    }
  };

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", active: false },
    { icon: PieChart, label: "Analytics", href: "/analytics", active: true },
    { icon: CreditCard, label: "Subscriptions", href: "/subscriptions", active: false },
    { icon: Wallet, label: "Wallets", href: "/wallets", active: false },
    { icon: Crown, label: "Pricing", href: "/pricing", active: false },
    { icon: Settings, label: "Settings", href: "/settings", active: false },
  ];

  return (
    <>
      <Helmet>
        <title>Analytics - MoneyFlow</title>
        <meta name="description" content="View your spending analytics and insights." />
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-out ${
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

          {mobileMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border shadow-lg animate-fade-in">
              <div className="p-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-out ${
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
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary transition-all duration-300 ease-out w-full"
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
              <h1 className="text-2xl font-semibold">Analytics</h1>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setImportOpen(true)}
                  className="rounded-xl gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Import</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExportOpen(true)}
                  className="rounded-xl gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
            </div>

            {/* Export dialog */}
            <Dialog open={exportOpen} onOpenChange={setExportOpen}>
              <DialogContent className="p-0 gap-0 overflow-hidden [&>button]:hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-popover">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExportOpen(false)}
                    className="text-muted-foreground hover:text-foreground font-semibold h-9 px-3"
                  >
                    Cancel
                  </Button>
                  <h3 className="font-semibold text-base">Export Data</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      downloadExport(exportFormat);
                      setExportOpen(false);
                    }}
                    className="text-primary hover:text-primary font-semibold h-9 px-3"
                  >
                    Download
                  </Button>
                </div>

                <div className="p-4 space-y-4">
                  <p className="text-sm text-muted-foreground">Select a format to download your transactions.</p>
                  <div className="space-y-2">
                    <Label className="text-sm">Format</Label>
                    <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as "csv" | "json")}>
                      <SelectTrigger className="rounded-xl h-11 border-transparent bg-secondary/50">
                        <SelectValue placeholder="Choose format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Import dialog */}
            <Dialog open={importOpen} onOpenChange={setImportOpen}>
              <DialogContent className="p-0 gap-0 overflow-hidden [&>button]:hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-popover">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setImportOpen(false)}
                    className="text-muted-foreground hover:text-foreground font-semibold h-9 px-3"
                  >
                    Cancel
                  </Button>
                  <h3 className="font-semibold text-base">Import Data</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleImport}
                    className="text-primary hover:text-primary font-semibold h-9 px-3"
                  >
                    Import
                  </Button>
                </div>

                <div className="p-4 space-y-4">
                  <p className="text-sm text-muted-foreground">Import transactions from a CSV or JSON file.</p>
                  <div className="space-y-2">
                    <Label className="text-sm">Format</Label>
                    <Select value={importFormat} onValueChange={(v) => setImportFormat(v as "csv" | "json")}>
                      <SelectTrigger className="rounded-xl h-11 border-transparent bg-secondary/50">
                        <SelectValue placeholder="Choose format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">File</Label>
                    <Input
                      type="file"
                      accept={importFormat === "csv" ? ".csv,text/csv" : ".json,application/json"}
                      onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
                      className="rounded-xl h-11 border-transparent bg-secondary/50"
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Summary Cards */}
            <Card className="p-6 rounded-2xl border-border/50">
              <h3 className="text-base font-semibold mb-4">Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-secondary/60 dark:bg-secondary/30 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground break-words">Total Spent</span>
                  </div>
                  <p className="text-xl font-semibold break-words">{formatCurrency(totalSpent)}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/60 dark:bg-secondary/30 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground break-words">Avg/Day</span>
                  </div>
                  <p className="text-xl font-semibold break-words">{formatCurrency(avgPerDay)}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/60 dark:bg-secondary/30 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground break-words">Highest</span>
                  </div>
                  <p className="text-xl font-semibold break-words">{formatCurrency(highestSpend)}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/60 dark:bg-secondary/30 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <PieChart className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground break-words">Top Category</span>
                  </div>
                  <p className="text-lg sm:text-xl font-semibold capitalize break-words">{topCategory?.[0]?.replace("-", " ") || "N/A"}</p>
                </div>
              </div>
            </Card>

            {/* Spending Trend */}
            <Card className="p-6 rounded-2xl border-border/50">
              <h3 className="text-base font-semibold mb-4">Spending Trend</h3>
              <div className="h-[280px]">
                {trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                        tickFormatter={(value) => `${currencySymbol}${value}`}
                        dx={-10}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                                <p className="text-sm text-muted-foreground">{payload[0].payload.date}</p>
                                <p className="font-semibold text-primary">
                                  {formatCurrency(payload[0].value as number)}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 5 }}
                        activeDot={{ r: 7, fill: "hsl(var(--primary))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No spending data available
                  </div>
                )}
              </div>
            </Card>

            {/* Category Breakdown */}
            <Card className="p-6 rounded-2xl border-border/50">
              <h3 className="text-base font-semibold mb-4">Category Breakdown</h3>
              <div className="h-[300px]">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                                <p className="font-medium">{payload[0].name}</p>
                                <p className="text-primary font-semibold">
                                  {formatCurrency(payload[0].value as number)}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No category data available
                  </div>
                )}
              </div>
              {pieData.length > 0 && (
                <div className="flex flex-wrap gap-4 justify-center mt-4">
                  {pieData.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Spending Time of Day */}
            <Card className="p-6 rounded-2xl border-border/50">
              <h3 className="text-base font-semibold mb-4">Spending by Time of Day</h3>
              <div className="space-y-4">
                {Object.entries(timeOfDay).map(([time, amount]) => (
                  <div key={time} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize text-muted-foreground">{time}</span>
                      <span className="font-medium">{formatCurrency(amount)}</span>
                    </div>
                    <Progress
                      value={totalTimeOfDay > 0 ? (amount / totalTimeOfDay) * 100 : 0}
                      className="h-3"
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Transactions - filtered by wallet */}
            <RecentTransactionsCard 
              transactions={walletTransactions} 
              currencySymbol={currencySymbol}
              onUpdate={updateTransaction}
              onDelete={deleteTransaction}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default Analytics;
