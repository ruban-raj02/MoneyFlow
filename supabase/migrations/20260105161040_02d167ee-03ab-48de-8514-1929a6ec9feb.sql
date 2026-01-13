-- Add wallet_id column to subscriptions table for wallet-based data persistence
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS wallet_id uuid REFERENCES public.wallets(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_wallet_id ON public.subscriptions(wallet_id);