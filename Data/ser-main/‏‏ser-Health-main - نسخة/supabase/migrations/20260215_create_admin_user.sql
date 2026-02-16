-- Add admin user type to the enum
ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'admin';

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE REFERENCES auth_users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    permissions JSONB DEFAULT '{"all": true}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user
-- Password: admin123 (hashed with SHA-256)
-- Note: In production, use bcrypt or similar
INSERT INTO auth_users (email, password_hash, user_type, status, email_verified)
VALUES (
    'admin@ser-health.com',
    '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', -- admin123
    'admin',
    'active',
    true
)
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Insert admin profile
INSERT INTO admins (auth_user_id, full_name, role)
SELECT id, 'مدير النظام', 'super_admin'
FROM auth_users
WHERE email = 'admin@ser-health.com'
ON CONFLICT (auth_user_id) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_users(email);
CREATE INDEX IF NOT EXISTS idx_auth_users_type ON auth_users(user_type);
CREATE INDEX IF NOT EXISTS idx_admins_auth_user_id ON admins(auth_user_id);
