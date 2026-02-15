-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user types
CREATE TYPE user_type AS ENUM ('doctor', 'hospital', 'volunteer', 'pharmacy', 'lab');

-- Create enum for account status
CREATE TYPE account_status AS ENUM ('pending', 'active', 'suspended', 'rejected');

-- Main authentication table
CREATE TABLE IF NOT EXISTS auth_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    user_type user_type NOT NULL,
    status account_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone VARCHAR(20),
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Doctors table (جدول الأطباء)
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE REFERENCES auth_users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    years_of_experience INTEGER,
    clinic_address TEXT,
    city VARCHAR(100),
    governorate VARCHAR(100),
    consultation_fee DECIMAL(10, 2),
    available_hours JSONB,
    bio TEXT,
    profile_image_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT rating_range CHECK (rating >= 0 AND rating <= 5)
);

-- Hospitals table (جدول المستشفيات)
CREATE TABLE IF NOT EXISTS hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE REFERENCES auth_users(id) ON DELETE CASCADE,
    hospital_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    hospital_type VARCHAR(100), -- عام، خاص، تعليمي
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    governorate VARCHAR(100) NOT NULL,
    phone_numbers TEXT[], -- array of phone numbers
    emergency_phone VARCHAR(20),
    email VARCHAR(255),
    website_url TEXT,
    total_beds INTEGER,
    available_beds INTEGER,
    departments JSONB, -- قائمة الأقسام المتاحة
    facilities JSONB, -- المرافق المتاحة
    insurance_accepted TEXT[], -- شركات التأمين المقبولة
    operating_hours JSONB,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT rating_range CHECK (rating >= 0 AND rating <= 5)
);

-- Volunteers table (جدول المتطوعين)
CREATE TABLE IF NOT EXISTS volunteers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE REFERENCES auth_users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    national_id VARCHAR(50) UNIQUE NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    address TEXT,
    city VARCHAR(100),
    governorate VARCHAR(100),
    skills TEXT[], -- المهارات المتاحة
    availability JSONB, -- أوقات التطوع المتاحة
    languages TEXT[], -- اللغات
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    bio TEXT,
    profile_image_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    total_hours_volunteered INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT rating_range CHECK (rating >= 0 AND rating <= 5)
);

-- Pharmacies table (جدول الصيدليات)
CREATE TABLE IF NOT EXISTS pharmacies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE REFERENCES auth_users(id) ON DELETE CASCADE,
    pharmacy_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    pharmacist_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    governorate VARCHAR(100) NOT NULL,
    phone_numbers TEXT[],
    email VARCHAR(255),
    operating_hours JSONB,
    services JSONB, -- الخدمات المتاحة (توصيل، استشارات، إلخ)
    delivery_available BOOLEAN DEFAULT FALSE,
    online_ordering BOOLEAN DEFAULT FALSE,
    insurance_accepted TEXT[],
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT rating_range CHECK (rating >= 0 AND rating <= 5)
);

-- Labs table (جدول المعامل)
CREATE TABLE IF NOT EXISTS labs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE REFERENCES auth_users(id) ON DELETE CASCADE,
    lab_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    lab_director_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    governorate VARCHAR(100) NOT NULL,
    phone_numbers TEXT[],
    email VARCHAR(255),
    operating_hours JSONB,
    test_types JSONB, -- أنواع التحاليل المتاحة
    home_service_available BOOLEAN DEFAULT FALSE,
    result_delivery_methods TEXT[], -- طرق استلام النتائج
    average_turnaround_time VARCHAR(100), -- متوسط وقت التسليم
    insurance_accepted TEXT[],
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT rating_range CHECK (rating >= 0 AND rating <= 5)
);

-- Create indexes for better performance
CREATE INDEX idx_auth_users_email ON auth_users(email);
CREATE INDEX idx_auth_users_type ON auth_users(user_type);
CREATE INDEX idx_auth_users_status ON auth_users(status);
CREATE INDEX idx_doctors_city ON doctors(city);
CREATE INDEX idx_doctors_specialization ON doctors(specialization);
CREATE INDEX idx_hospitals_city ON hospitals(city);
CREATE INDEX idx_pharmacies_city ON pharmacies(city);
CREATE INDEX idx_labs_city ON labs(city);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_auth_users_updated_at BEFORE UPDATE ON auth_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON hospitals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON volunteers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pharmacies_updated_at BEFORE UPDATE ON pharmacies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_labs_updated_at BEFORE UPDATE ON labs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE auth_users IS 'جدول المصادقة الرئيسي لجميع أنواع المستخدمين';
COMMENT ON TABLE doctors IS 'جدول بيانات الأطباء';
COMMENT ON TABLE hospitals IS 'جدول بيانات المستشفيات';
COMMENT ON TABLE volunteers IS 'جدول بيانات المتطوعين';
COMMENT ON TABLE pharmacies IS 'جدول بيانات الصيدليات';
COMMENT ON TABLE labs IS 'جدول بيانات المعامل والمختبرات';
