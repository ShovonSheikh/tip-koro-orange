-- Create payments table for comprehensive payment tracking
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_type TEXT CHECK (payment_type IN ('subscription', 'donation')) NOT NULL,
  reference_id UUID, -- Links to subscription_id or donation_id
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'BDT',
  payment_method TEXT DEFAULT 'rupantorpay',
  gateway TEXT DEFAULT 'rupantorpay',
  transaction_id TEXT UNIQUE,
  gateway_transaction_id TEXT,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  gateway_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments table
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update payments" ON public.payments
  FOR UPDATE USING (true);

-- Add donor_id column to donations table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'donations' AND column_name = 'donor_id'
  ) THEN
    ALTER TABLE public.donations ADD COLUMN donor_id UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Add updated_at trigger for payments
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();