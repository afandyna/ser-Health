-- Insert admin data into database
-- This script should be run in Supabase SQL Editor

-- First, ensure the admin user type exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type') THEN
        CREATE TYPE user_type AS ENUM ('doctor', 'hospital', 'volunteer', 'pharmacy', 'lab', 'admin');
    ELSE
        -- Add admin if it doesn't exist in the enum
        BEGIN
            ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'admin';
        EXCEPTION
            WHEN duplicate_object THEN null;
        END;
    END IF;
END $$;

-- Create admins table if not exists
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE REFERENCES auth_users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    permissions JSONB DEFAULT '{"all": true}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert admin user
-- Email: admin@ser-health.com
-- Password: admin123
-- Password hash (SHA-256): 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
INSERT INTO auth_users (email, password_hash, user_type, status, email_verified, phone)
VALUES (
    'admin@ser-health.com',
    '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
    'admin',
    'active',
    true,
    '+20-10-000-0000'
)
ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    user_type = EXCLUDED.user_type,
    status = EXCLUDED.status,
    email_verified = EXCLUDED.email_verified,
    phone = EXCLUDED.phone
RETURNING id;

-- Insert admin profile
INSERT INTO admins (auth_user_id, full_name, role, permissions)
SELECT 
    id, 
    'مدير النظام - Admin', 
    'super_admin',
    '{"all": true, "users": {"view": true, "edit": true, "delete": true, "approve": true}, "content": {"view": true, "edit": true, "delete": true}}'::jsonb
FROM auth_users
WHERE email = 'admin@ser-health.com'
ON CONFLICT (auth_user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    permissions = EXCLUDED.permissions;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_users(email);
CREATE INDEX IF NOT EXISTS idx_auth_users_type ON auth_users(user_type);
CREATE INDEX IF NOT EXISTS idx_auth_users_status ON auth_users(status);
CREATE INDEX IF NOT EXISTS idx_admins_auth_user_id ON admins(auth_user_id);

-- Verify the admin was created
SELECT 
    au.id,
    au.email,
    au.user_type,
    au.status,
    a.full_name,
    a.role,
    a.permissions
FROM auth_users au
LEFT JOIN admins a ON au.id = a.auth_user_id
WHERE au.email = 'admin@ser-health.com';
