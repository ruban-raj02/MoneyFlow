import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Store user email when they successfully sign in
        if (event === 'SIGNED_IN' && session?.user?.email) {
          localStorage.setItem('google_login_email', session.user.email);
          localStorage.setItem('google_auth_completed', 'true');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const userId = user?.id;
    const hasCompletedOnboarding = userId ? localStorage.getItem(`onboarding_complete_${userId}`) : null;
    const redirectUrl = hasCompletedOnboarding 
      ? `${window.location.origin}/dashboard`
      : `${window.location.origin}/onboarding`;
    
    // Get saved email from previous login
    const savedEmail = localStorage.getItem('google_login_email');
    
    // Build query params
    const queryParams: Record<string, string> = {
      access_type: 'offline',
    };
    
    // Add login_hint to pre-select account and adjust prompt
    if (savedEmail) {
      queryParams.login_hint = savedEmail;
      // On mobile, select_account with login_hint
      queryParams.prompt = 'select_account';
    } else {
      queryParams.prompt = 'consent';
    }
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        queryParams: queryParams,
        scopes: 'email profile',
      },
    });
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    // Clear auth flags on sign out
    localStorage.removeItem('google_auth_completed');
    localStorage.removeItem('google_login_email');
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};