-- Migration: Make Automation and Expiration

-- 1. Add google_event_id column to appointments table
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS google_event_id TEXT;

-- 2. Enable pg_cron extension (required for scheduling tasks natively)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 3. Create function to cancel pending appointments older than 6 hours
CREATE OR REPLACE FUNCTION cancel_expired_pending_appointments()
RETURNS void AS $$
BEGIN
  UPDATE public.appointments
  SET status = 'Cancelado'
  WHERE status = 'Pendente'
    AND created_at < NOW() - INTERVAL '6 hours';
END;
$$ LANGUAGE plpgsql;

-- 4. Schedule the function to run every hour
-- This will automatically free up the time slot and trigger the Webhook (UPDATE)
-- so Make.com can send the cancellation email to the client.
SELECT cron.schedule('cancel-expired-appointments', '0 * * * *', $$
  SELECT cancel_expired_pending_appointments();
$$);
