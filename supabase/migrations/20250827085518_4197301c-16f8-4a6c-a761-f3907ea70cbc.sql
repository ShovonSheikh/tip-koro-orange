-- Update the first user in the users table to have an active subscription
UPDATE public.users 
SET 
  subscription_status = 'active',
  subscription_expires_at = NOW() + INTERVAL '30 days',
  updated_at = NOW()
WHERE id = (
  SELECT id FROM public.users 
  ORDER BY created_at ASC 
  LIMIT 1
);