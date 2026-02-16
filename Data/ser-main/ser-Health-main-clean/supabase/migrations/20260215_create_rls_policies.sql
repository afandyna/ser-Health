-- Enable Row Level Security on all tables
ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE labs ENABLE ROW LEVEL SECURITY;

-- Auth Users Policies
-- Users can read their own data
CREATE POLICY "Users can view their own auth data"
    ON auth_users FOR SELECT
    USING (auth.uid()::text = id::text);

-- Users can update their own data
CREATE POLICY "Users can update their own auth data"
    ON auth_users FOR UPDATE
    USING (auth.uid()::text = id::text);

-- Allow public to view active users (for listings)
CREATE POLICY "Public can view active users"
    ON auth_users FOR SELECT
    USING (status = 'active');

-- Doctors Policies
-- Doctors can read their own data
CREATE POLICY "Doctors can view their own data"
    ON doctors FOR SELECT
    USING (auth_user_id = auth.uid());

-- Doctors can update their own data
CREATE POLICY "Doctors can update their own data"
    ON doctors FOR UPDATE
    USING (auth_user_id = auth.uid());

-- Public can view verified doctors
CREATE POLICY "Public can view verified doctors"
    ON doctors FOR SELECT
    USING (verified = true);

-- Hospitals Policies
-- Hospitals can read their own data
CREATE POLICY "Hospitals can view their own data"
    ON hospitals FOR SELECT
    USING (auth_user_id = auth.uid());

-- Hospitals can update their own data
CREATE POLICY "Hospitals can update their own data"
    ON hospitals FOR UPDATE
    USING (auth_user_id = auth.uid());

-- Public can view verified hospitals
CREATE POLICY "Public can view verified hospitals"
    ON hospitals FOR SELECT
    USING (verified = true);

-- Volunteers Policies
-- Volunteers can read their own data
CREATE POLICY "Volunteers can view their own data"
    ON volunteers FOR SELECT
    USING (auth_user_id = auth.uid());

-- Volunteers can update their own data
CREATE POLICY "Volunteers can update their own data"
    ON volunteers FOR UPDATE
    USING (auth_user_id = auth.uid());

-- Public can view verified volunteers
CREATE POLICY "Public can view verified volunteers"
    ON volunteers FOR SELECT
    USING (verified = true);

-- Pharmacies Policies
-- Pharmacies can read their own data
CREATE POLICY "Pharmacies can view their own data"
    ON pharmacies FOR SELECT
    USING (auth_user_id = auth.uid());

-- Pharmacies can update their own data
CREATE POLICY "Pharmacies can update their own data"
    ON pharmacies FOR UPDATE
    USING (auth_user_id = auth.uid());

-- Public can view verified pharmacies
CREATE POLICY "Public can view verified pharmacies"
    ON pharmacies FOR SELECT
    USING (verified = true);

-- Labs Policies
-- Labs can read their own data
CREATE POLICY "Labs can view their own data"
    ON labs FOR SELECT
    USING (auth_user_id = auth.uid());

-- Labs can update their own data
CREATE POLICY "Labs can update their own data"
    ON labs FOR UPDATE
    USING (auth_user_id = auth.uid());

-- Public can view verified labs
CREATE POLICY "Public can view verified labs"
    ON labs FOR SELECT
    USING (verified = true);

-- Insert policies (for registration)
CREATE POLICY "Allow insert for new doctors"
    ON doctors FOR INSERT
    WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Allow insert for new hospitals"
    ON hospitals FOR INSERT
    WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Allow insert for new volunteers"
    ON volunteers FOR INSERT
    WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Allow insert for new pharmacies"
    ON pharmacies FOR INSERT
    WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Allow insert for new labs"
    ON labs FOR INSERT
    WITH CHECK (auth_user_id = auth.uid());
