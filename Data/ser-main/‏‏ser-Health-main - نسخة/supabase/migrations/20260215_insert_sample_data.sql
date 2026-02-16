-- Sample data for testing
-- Note: In production, passwords should be properly hashed using bcrypt or similar

-- Insert sample auth users
INSERT INTO auth_users (email, password_hash, user_type, status, email_verified, phone) VALUES
-- Doctors
('dr.ahmed@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'doctor', 'active', true, '+201234567890'),
('dr.fatima@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'doctor', 'active', true, '+201234567891'),

-- Hospitals
('info@cairo.hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'hospital', 'active', true, '+201234567892'),
('contact@alex.hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'hospital', 'active', true, '+201234567893'),

-- Volunteers
('volunteer1@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'volunteer', 'active', true, '+201234567894'),
('volunteer2@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'volunteer', 'pending', true, '+201234567895'),

-- Pharmacies
('info@elshifa.pharmacy.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'pharmacy', 'active', true, '+201234567896'),
('contact@seha.pharmacy.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'pharmacy', 'active', true, '+201234567897'),

-- Labs
('info@alpha.lab.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'lab', 'active', true, '+201234567898'),
('contact@beta.lab.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'lab', 'active', true, '+201234567899');

-- Insert sample doctors
INSERT INTO doctors (auth_user_id, full_name, specialization, license_number, years_of_experience, clinic_address, city, governorate, consultation_fee, bio, verified, rating, total_reviews) VALUES
((SELECT id FROM auth_users WHERE email = 'dr.ahmed@example.com'), 'د. أحمد محمد', 'طب القلب', 'DOC-2024-001', 15, 'شارع الجمهورية، وسط البلد', 'القاهرة', 'القاهرة', 300.00, 'استشاري أمراض القلب والأوعية الدموية مع خبرة 15 عام', true, 4.8, 125),
((SELECT id FROM auth_users WHERE email = 'dr.fatima@example.com'), 'د. فاطمة علي', 'طب الأطفال', 'DOC-2024-002', 10, 'شارع النيل، المعادي', 'القاهرة', 'القاهرة', 250.00, 'استشارية طب الأطفال وحديثي الولادة', true, 4.9, 200);

-- Insert sample hospitals
INSERT INTO hospitals (auth_user_id, hospital_name, registration_number, hospital_type, address, city, governorate, phone_numbers, emergency_phone, email, total_beds, available_beds, verified, rating, total_reviews) VALUES
((SELECT id FROM auth_users WHERE email = 'info@cairo.hospital.com'), 'مستشفى القاهرة الدولي', 'HOSP-2024-001', 'خاص', 'شارع الهرم، الجيزة', 'الجيزة', 'الجيزة', ARRAY['+20233445566', '+20233445567'], '+20233445568', 'info@cairo.hospital.com', 200, 45, true, 4.5, 350),
((SELECT id FROM auth_users WHERE email = 'contact@alex.hospital.com'), 'مستشفى الإسكندرية الجامعي', 'HOSP-2024-002', 'تعليمي', 'شارع الحرية، سموحة', 'الإسكندرية', 'الإسكندرية', ARRAY['+20355667788'], '+20355667789', 'contact@alex.hospital.com', 500, 120, true, 4.7, 280);

-- Insert sample volunteers
INSERT INTO volunteers (auth_user_id, full_name, national_id, date_of_birth, gender, address, city, governorate, skills, languages, bio, verified, total_hours_volunteered, rating, total_reviews) VALUES
((SELECT id FROM auth_users WHERE email = 'volunteer1@example.com'), 'محمد حسن', '29012345678901', '1990-05-15', 'ذكر', 'مدينة نصر', 'القاهرة', 'القاهرة', ARRAY['إسعافات أولية', 'قيادة'], ARRAY['العربية', 'الإنجليزية'], 'متطوع نشط في المجال الصحي', true, 150, 4.6, 45),
((SELECT id FROM auth_users WHERE email = 'volunteer2@example.com'), 'سارة أحمد', '29112345678902', '1995-08-20', 'أنثى', 'الزمالك', 'القاهرة', 'القاهرة', ARRAY['تمريض', 'إسعافات أولية'], ARRAY['العربية', 'الفرنسية'], 'ممرضة متطوعة', false, 80, 4.8, 30);

-- Insert sample pharmacies
INSERT INTO pharmacies (auth_user_id, pharmacy_name, license_number, pharmacist_name, address, city, governorate, phone_numbers, email, delivery_available, online_ordering, verified, rating, total_reviews) VALUES
((SELECT id FROM auth_users WHERE email = 'info@elshifa.pharmacy.com'), 'صيدلية الشفاء', 'PHARM-2024-001', 'د. خالد محمود', 'شارع فيصل، الهرم', 'الجيزة', 'الجيزة', ARRAY['+20233556677'], 'info@elshifa.pharmacy.com', true, true, true, 4.7, 180),
((SELECT id FROM auth_users WHERE email = 'contact@seha.pharmacy.com'), 'صيدلية الصحة', 'PHARM-2024-002', 'د. منى سعيد', 'شارع الجامعة، المنصورة', 'المنصورة', 'الدقهلية', ARRAY['+20502334455'], 'contact@seha.pharmacy.com', true, false, true, 4.5, 95);

-- Insert sample labs
INSERT INTO labs (auth_user_id, lab_name, license_number, lab_director_name, address, city, governorate, phone_numbers, email, home_service_available, average_turnaround_time, verified, rating, total_reviews) VALUES
((SELECT id FROM auth_users WHERE email = 'info@alpha.lab.com'), 'معمل ألفا للتحاليل الطبية', 'LAB-2024-001', 'د. أيمن عبدالله', 'شارع الثورة، مصر الجديدة', 'القاهرة', 'القاهرة', ARRAY['+20222334455'], 'info@alpha.lab.com', true, '24 ساعة', true, 4.8, 220),
((SELECT id FROM auth_users WHERE email = 'contact@beta.lab.com'), 'معمل بيتا المركزي', 'LAB-2024-002', 'د. نادية حسن', 'شارع المحطة، طنطا', 'طنطا', 'الغربية', ARRAY['+20403334455'], 'contact@beta.lab.com', false, '48 ساعة', true, 4.6, 150);

-- Note: Default password for all test accounts is 'password123'
-- In production, use proper password hashing and secure passwords
