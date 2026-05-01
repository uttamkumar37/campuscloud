-- Task 48: Payment Gateway Integration
-- Add Razorpay gateway order ID to tenant_subscriptions so we can
-- match an incoming webhook back to the correct subscription.

ALTER TABLE public.tenant_subscriptions
    ADD COLUMN IF NOT EXISTS gateway_order_id VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_tenant_subscriptions_gateway_order_id
    ON public.tenant_subscriptions(gateway_order_id);
