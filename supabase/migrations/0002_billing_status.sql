ALTER TABLE public.companies 
ADD COLUMN subscription_status text DEFAULT 'FREE',
ADD COLUMN razorpay_customer_id text,
ADD COLUMN razorpay_subscription_id text;
