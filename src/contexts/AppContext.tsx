import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Transaction {
  id: string;
  type: "expense" | "income";
  category: string;
  amount: number;
  description: string;
  date: string;
  wallet_id?: string;
}

export interface WalletItem {
  id: string;
  name: string;
  currency: string;
  currencySymbol: string;
  country: string;
  isActive: boolean;
}

interface AppContextType {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>;
  updateTransaction: (updated: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  wallets: WalletItem[];
  setWallets: React.Dispatch<React.SetStateAction<WalletItem[]>>;
  addWallet: (wallet: Omit<WalletItem, "id">) => Promise<void>;
  activeWallet: WalletItem | undefined;
  loading: boolean;
  eraseAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<WalletItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch wallets and transactions when user logs in
  useEffect(() => {
    if (user) {
      fetchWallets();
      fetchTransactions();
    } else {
      setWallets([]);
      setTransactions([]);
      setLoading(false);
    }
  }, [user]);

  const fetchWallets = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      let mappedWallets: WalletItem[] = (data || []).map((w: any) => ({
        id: w.id,
        name: w.name,
        currency: w.currency,
        currencySymbol: w.currency_symbol,
        country: w.country || "",
        isActive: w.is_active,
      }));

      // If only one wallet exists, ensure it's set as active
      if (mappedWallets.length === 1 && !mappedWallets[0].isActive) {
        mappedWallets = [{ ...mappedWallets[0], isActive: true }];
        // Update in database
        await supabase
          .from("wallets")
          .update({ is_active: true })
          .eq("id", mappedWallets[0].id);
      }

      setWallets(mappedWallets);
    } catch (error) {
      console.error("Error fetching wallets:", error);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("transaction_date", { ascending: false });

      if (error) throw error;

      const mappedTransactions: Transaction[] = (data || []).map((t: any) => ({
        id: t.id,
        type: t.type as "expense" | "income",
        category: t.category,
        amount: parseFloat(t.amount),
        description: t.description || "",
        date: t.transaction_date,
        wallet_id: t.wallet_id,
      }));

      setTransactions(mappedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          type: transaction.type,
          category: transaction.category,
          amount: transaction.amount,
          description: transaction.description,
          transaction_date: transaction.date,
          wallet_id: transaction.wallet_id || null,
        })
        .select()
        .single();

      if (error) throw error;

      const newTransaction: Transaction = {
        id: data.id,
        type: data.type as "expense" | "income",
        category: data.category,
        amount: parseFloat(String(data.amount)),
        description: data.description || "",
        date: data.transaction_date,
        wallet_id: data.wallet_id,
      };

      setTransactions((prev) => [newTransaction, ...prev]);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const updateTransaction = async (updated: Transaction) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("transactions")
        .update({
          type: updated.type,
          category: updated.category,
          amount: updated.amount,
          description: updated.description,
          transaction_date: updated.date,
          wallet_id: updated.wallet_id || null,
        })
        .eq("id", updated.id)
        .eq("user_id", user.id);

      if (error) throw error;

      setTransactions((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const addWallet = async (wallet: Omit<WalletItem, "id">) => {
    if (!user) return;

    try {
      // If this wallet is active, deactivate others first
      if (wallet.isActive) {
        await supabase
          .from("wallets")
          .update({ is_active: false })
          .eq("user_id", user.id);
      }

      const { data, error } = await supabase
        .from("wallets")
        .insert({
          user_id: user.id,
          name: wallet.name,
          currency: wallet.currency,
          currency_symbol: wallet.currencySymbol,
          country: wallet.country,
          is_active: wallet.isActive,
        })
        .select()
        .single();

      if (error) throw error;

      const newWallet: WalletItem = {
        id: data.id,
        name: data.name,
        currency: data.currency,
        currencySymbol: data.currency_symbol,
        country: data.country || "",
        isActive: data.is_active,
      };

      if (wallet.isActive) {
        setWallets((prev) => [
          ...prev.map((w) => ({ ...w, isActive: false })),
          newWallet,
        ]);
      } else {
        setWallets((prev) => [...prev, newWallet]);
      }
    } catch (error) {
      console.error("Error adding wallet:", error);
    }
  };

  const eraseAllData = async () => {
    if (!user) return;

    try {
      // Delete all transactions
      await supabase.from("transactions").delete().eq("user_id", user.id);
      
      // Delete all wallets
      await supabase.from("wallets").delete().eq("user_id", user.id);
      
      // Delete all subscriptions
      await supabase.from("subscriptions").delete().eq("user_id", user.id);
      
      // Delete all income sources
      await supabase.from("income_sources").delete().eq("user_id", user.id);
      
      // Delete all feedback
      await supabase.from("feedback").delete().eq("user_id", user.id);
      
      // Delete profile data
      await supabase.from("profiles").delete().eq("user_id", user.id);

      // Clear local state
      setTransactions([]);
      setWallets([]);
    } catch (error) {
      console.error("Error erasing data:", error);
      throw error;
    }
  };

  const activeWallet = wallets.find((w) => w.isActive);

  return (
    <AppContext.Provider
      value={{
        transactions,
        setTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        wallets,
        setWallets,
        addWallet,
        activeWallet,
        loading,
        eraseAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
