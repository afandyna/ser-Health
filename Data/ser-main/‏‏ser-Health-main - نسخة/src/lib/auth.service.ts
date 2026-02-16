import { supabase, hashPassword, verifyPassword } from './supabase';
import type {
    AuthUser,
    Doctor,
    Hospital,
    Volunteer,
    Pharmacy,
    Lab,
    DoctorRegistrationDTO,
    HospitalRegistrationDTO,
    VolunteerRegistrationDTO,
    PharmacyRegistrationDTO,
    LabRegistrationDTO,
    LoginDTO,
    AuthResponse,
    UserType,
} from '@/types/database.types';

// ==================== Authentication ====================

export async function login(credentials: LoginDTO): Promise<AuthResponse> {
    // Get user with all possible profiles
    const { data: user, error } = await supabase
        .from('auth_users')
        .select(`
      *,
      doctors(*),
      hospitals(*),
      volunteers(*),
      pharmacies(*),
      labs(*)
    `)
        .eq('email', credentials.email)
        .single();

    if (error) throw new Error('Invalid email or password');
    if (!user) throw new Error('User not found');

    // Verify password
    const isValid = await verifyPassword(credentials.password, user.password_hash);
    if (!isValid) throw new Error('Invalid email or password');

    // Check account status
    if (user.status !== 'active') {
        throw new Error(`Account is ${user.status}. Please contact support.`);
    }

    // Update last login
    await supabase
        .from('auth_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

    // Get the appropriate profile based on user type
    let profile: Doctor | Hospital | Volunteer | Pharmacy | Lab;

    switch (user.user_type) {
        case 'doctor':
            profile = user.doctors[0];
            break;
        case 'hospital':
            profile = user.hospitals[0];
            break;
        case 'volunteer':
            profile = user.volunteers[0];
            break;
        case 'pharmacy':
            profile = user.pharmacies[0];
            break;
        case 'lab':
            profile = user.labs[0];
            break;
        default:
            throw new Error('Invalid user type');
    }

    return { user, profile };
}

// ==================== Doctor Registration ====================

export async function registerDoctor(data: DoctorRegistrationDTO): Promise<AuthResponse> {
    // Check if email already exists
    const { data: existingUser } = await supabase
        .from('auth_users')
        .select('id')
        .eq('email', data.email)
        .single();

    if (existingUser) {
        throw new Error('Email already registered');
    }

    // Create auth user
    const { data: authUser, error: authError } = await supabase
        .from('auth_users')
        .insert({
            email: data.email,
            password_hash: await hashPassword(data.password),
            user_type: 'doctor' as UserType,
            phone: data.phone,
        })
        .select()
        .single();

    if (authError) throw authError;

    // Create doctor profile
    const { data: doctor, error: doctorError } = await supabase
        .from('doctors')
        .insert({
            auth_user_id: authUser.id,
            full_name: data.full_name,
            specialization: data.specialization,
            license_number: data.license_number,
            years_of_experience: data.years_of_experience,
            clinic_address: data.clinic_address,
            city: data.city,
            governorate: data.governorate,
            consultation_fee: data.consultation_fee,
            bio: data.bio,
        })
        .select()
        .single();

    if (doctorError) {
        // Rollback auth user creation
        await supabase.from('auth_users').delete().eq('id', authUser.id);
        throw doctorError;
    }

    return { user: authUser, profile: doctor };
}

// ==================== Hospital Registration ====================

export async function registerHospital(data: HospitalRegistrationDTO): Promise<AuthResponse> {
    const { data: existingUser } = await supabase
        .from('auth_users')
        .select('id')
        .eq('email', data.email)
        .single();

    if (existingUser) {
        throw new Error('Email already registered');
    }

    const { data: authUser, error: authError } = await supabase
        .from('auth_users')
        .insert({
            email: data.email,
            password_hash: await hashPassword(data.password),
            user_type: 'hospital' as UserType,
            phone: data.phone,
        })
        .select()
        .single();

    if (authError) throw authError;

    const { data: hospital, error: hospitalError } = await supabase
        .from('hospitals')
        .insert({
            auth_user_id: authUser.id,
            hospital_name: data.hospital_name,
            registration_number: data.registration_number,
            hospital_type: data.hospital_type,
            address: data.address,
            city: data.city,
            governorate: data.governorate,
            phone_numbers: data.phone_numbers,
            emergency_phone: data.emergency_phone,
            website_url: data.website_url,
            total_beds: data.total_beds,
        })
        .select()
        .single();

    if (hospitalError) {
        await supabase.from('auth_users').delete().eq('id', authUser.id);
        throw hospitalError;
    }

    return { user: authUser, profile: hospital };
}

// ==================== Volunteer Registration ====================

export async function registerVolunteer(data: VolunteerRegistrationDTO): Promise<AuthResponse> {
    const { data: existingUser } = await supabase
        .from('auth_users')
        .select('id')
        .eq('email', data.email)
        .single();

    if (existingUser) {
        throw new Error('Email already registered');
    }

    const { data: authUser, error: authError } = await supabase
        .from('auth_users')
        .insert({
            email: data.email,
            password_hash: await hashPassword(data.password),
            user_type: 'volunteer' as UserType,
            phone: data.phone,
        })
        .select()
        .single();

    if (authError) throw authError;

    const { data: volunteer, error: volunteerError } = await supabase
        .from('volunteers')
        .insert({
            auth_user_id: authUser.id,
            full_name: data.full_name,
            national_id: data.national_id,
            date_of_birth: data.date_of_birth,
            gender: data.gender,
            address: data.address,
            city: data.city,
            governorate: data.governorate,
            skills: data.skills,
            languages: data.languages,
            bio: data.bio,
        })
        .select()
        .single();

    if (volunteerError) {
        await supabase.from('auth_users').delete().eq('id', authUser.id);
        throw volunteerError;
    }

    return { user: authUser, profile: volunteer };
}

// ==================== Pharmacy Registration ====================

export async function registerPharmacy(data: PharmacyRegistrationDTO): Promise<AuthResponse> {
    const { data: existingUser } = await supabase
        .from('auth_users')
        .select('id')
        .eq('email', data.email)
        .single();

    if (existingUser) {
        throw new Error('Email already registered');
    }

    const { data: authUser, error: authError } = await supabase
        .from('auth_users')
        .insert({
            email: data.email,
            password_hash: await hashPassword(data.password),
            user_type: 'pharmacy' as UserType,
            phone: data.phone,
        })
        .select()
        .single();

    if (authError) throw authError;

    const { data: pharmacy, error: pharmacyError } = await supabase
        .from('pharmacies')
        .insert({
            auth_user_id: authUser.id,
            pharmacy_name: data.pharmacy_name,
            license_number: data.license_number,
            pharmacist_name: data.pharmacist_name,
            address: data.address,
            city: data.city,
            governorate: data.governorate,
            phone_numbers: data.phone_numbers,
            delivery_available: data.delivery_available || false,
            online_ordering: data.online_ordering || false,
        })
        .select()
        .single();

    if (pharmacyError) {
        await supabase.from('auth_users').delete().eq('id', authUser.id);
        throw pharmacyError;
    }

    return { user: authUser, profile: pharmacy };
}

// ==================== Lab Registration ====================

export async function registerLab(data: LabRegistrationDTO): Promise<AuthResponse> {
    const { data: existingUser } = await supabase
        .from('auth_users')
        .select('id')
        .eq('email', data.email)
        .single();

    if (existingUser) {
        throw new Error('Email already registered');
    }

    const { data: authUser, error: authError } = await supabase
        .from('auth_users')
        .insert({
            email: data.email,
            password_hash: await hashPassword(data.password),
            user_type: 'lab' as UserType,
            phone: data.phone,
        })
        .select()
        .single();

    if (authError) throw authError;

    const { data: lab, error: labError } = await supabase
        .from('labs')
        .insert({
            auth_user_id: authUser.id,
            lab_name: data.lab_name,
            license_number: data.license_number,
            lab_director_name: data.lab_director_name,
            address: data.address,
            city: data.city,
            governorate: data.governorate,
            phone_numbers: data.phone_numbers,
            home_service_available: data.home_service_available || false,
            average_turnaround_time: data.average_turnaround_time,
        })
        .select()
        .single();

    if (labError) {
        await supabase.from('auth_users').delete().eq('id', authUser.id);
        throw labError;
    }

    return { user: authUser, profile: lab };
}

// ==================== Public Queries ====================

export async function getVerifiedDoctors(filters?: { city?: string; specialization?: string }) {
    let query = supabase
        .from('doctors')
        .select('*')
        .eq('verified', true);

    if (filters?.city) {
        query = query.eq('city', filters.city);
    }

    if (filters?.specialization) {
        query = query.eq('specialization', filters.specialization);
    }

    const { data, error } = await query.order('rating', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getVerifiedHospitals(filters?: { city?: string; governorate?: string }) {
    let query = supabase
        .from('hospitals')
        .select('*')
        .eq('verified', true);

    if (filters?.city) {
        query = query.eq('city', filters.city);
    }

    if (filters?.governorate) {
        query = query.eq('governorate', filters.governorate);
    }

    const { data, error } = await query.order('rating', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getVerifiedPharmacies(filters?: { city?: string; delivery_available?: boolean }) {
    let query = supabase
        .from('pharmacies')
        .select('*')
        .eq('verified', true);

    if (filters?.city) {
        query = query.eq('city', filters.city);
    }

    if (filters?.delivery_available !== undefined) {
        query = query.eq('delivery_available', filters.delivery_available);
    }

    const { data, error } = await query.order('rating', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getVerifiedLabs(filters?: { city?: string; home_service_available?: boolean }) {
    let query = supabase
        .from('labs')
        .select('*')
        .eq('verified', true);

    if (filters?.city) {
        query = query.eq('city', filters.city);
    }

    if (filters?.home_service_available !== undefined) {
        query = query.eq('home_service_available', filters.home_service_available);
    }

    const { data, error } = await query.order('rating', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getVerifiedVolunteers(filters?: { city?: string; skills?: string[] }) {
    let query = supabase
        .from('volunteers')
        .select('*')
        .eq('verified', true);

    if (filters?.city) {
        query = query.eq('city', filters.city);
    }

    if (filters?.skills && filters.skills.length > 0) {
        query = query.contains('skills', filters.skills);
    }

    const { data, error } = await query.order('rating', { ascending: false });

    if (error) throw error;
    return data;
}
