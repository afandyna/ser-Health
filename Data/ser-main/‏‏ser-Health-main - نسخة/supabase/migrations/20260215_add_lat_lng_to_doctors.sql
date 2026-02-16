-- Add latitude and longitude to doctors table
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
