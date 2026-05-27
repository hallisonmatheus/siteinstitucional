-- Migration: Add time column to blocked_dates and update constraints to support blocking specific hours

-- 1. Remove the old unique constraint on date (if it exists)
-- In postgres, UNIQUE constraints are backed by an index, usually named "blocked_dates_date_key"
ALTER TABLE public.blocked_dates DROP CONSTRAINT IF EXISTS blocked_dates_date_key;

-- 2. Add time column (nullable, where NULL means the entire day is blocked)
ALTER TABLE public.blocked_dates ADD COLUMN IF NOT EXISTS time TIME DEFAULT NULL;

-- 3. Add a new unique constraint on (date, time) to prevent duplicate blocks
ALTER TABLE public.blocked_dates ADD CONSTRAINT unique_blocked_date_time UNIQUE (date, time);
