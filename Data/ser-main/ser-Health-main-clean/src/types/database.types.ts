// Database Types for Authentication System

export type UserType = 'doctor' | 'hospital' | 'volunteer' | 'pharmacy' | 'lab' | 'admin';
export type AccountStatus = 'pending' | 'active' | 'suspended' | 'rejected';

export interface AuthUser {
    id: string;
    email: string;
    password_hash: string;
    user_type: UserType;
    status: AccountStatus;
    created_at: string;
    updated_at: string;
    last_login?: string;
    email_verified: boolean;
    phone?: string;
}

export interface Doctor {
    id: string;
    auth_user_id: string;
    full_name: string;
    specialization: string;
    license_number: string;
    years_of_experience?: number;
    clinic_address?: string;
    city?: string;
    governorate?: string;
    consultation_fee?: number;
    available_hours?: Record<string, any>;
    latitude?: number;
    longitude?: number;
    bio?: string;
    profile_image_url?: string;
    verified: boolean;
    rating: number;
    total_reviews: number;
    created_at: string;
    updated_at: string;
}

export interface Hospital {
    id: string;
    auth_user_id: string;
    hospital_name: string;
    registration_number: string;
    hospital_type?: string;
    address: string;
    city: string;
    governorate: string;
    phone_numbers?: string[];
    emergency_phone?: string;
    email?: string;
    website_url?: string;
    total_beds?: number;
    available_beds?: number;
    departments?: Record<string, any>;
    facilities?: Record<string, any>;
    insurance_accepted?: string[];
    operating_hours?: Record<string, any>;
    latitude?: number;
    longitude?: number;
    verified: boolean;
    rating: number;
    total_reviews: number;
    created_at: string;
    updated_at: string;
}

export interface Volunteer {
    id: string;
    auth_user_id: string;
    full_name: string;
    national_id: string;
    date_of_birth?: string;
    gender?: string;
    address?: string;
    city?: string;
    governorate?: string;
    skills?: string[];
    availability?: Record<string, any>;
    languages?: string[];
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    bio?: string;
    profile_image_url?: string;
    verified: boolean;
    total_hours_volunteered: number;
    rating: number;
    total_reviews: number;
    created_at: string;
    updated_at: string;
}

export interface Pharmacy {
    id: string;
    auth_user_id: string;
    pharmacy_name: string;
    license_number: string;
    pharmacist_name: string;
    address: string;
    city: string;
    governorate: string;
    phone_numbers?: string[];
    email?: string;
    operating_hours?: Record<string, any>;
    services?: Record<string, any>;
    delivery_available: boolean;
    online_ordering: boolean;
    insurance_accepted?: string[];
    latitude?: number;
    longitude?: number;
    verified: boolean;
    rating: number;
    total_reviews: number;
    created_at: string;
    updated_at: string;
}

export interface Lab {
    id: string;
    auth_user_id: string;
    lab_name: string;
    license_number: string;
    lab_director_name: string;
    address: string;
    city: string;
    governorate: string;
    phone_numbers?: string[];
    email?: string;
    operating_hours?: Record<string, any>;
    test_types?: Record<string, any>;
    home_service_available: boolean;
    result_delivery_methods?: string[];
    average_turnaround_time?: string;
    insurance_accepted?: string[];
    latitude?: number;
    longitude?: number;
    verified: boolean;
    rating: number;
    total_reviews: number;
    created_at: string;
    updated_at: string;
}

export interface Admin {
    id: string;
    auth_user_id: string;
    full_name: string;
    role: string;
    permissions: Record<string, any>;
    created_at: string;
    updated_at: string;
}

// Registration DTOs
export interface DoctorRegistrationDTO {
    email: string;
    password: string;
    phone?: string;
    full_name: string;
    specialization: string;
    license_number: string;
    years_of_experience?: number;
    clinic_address?: string;
    city?: string;
    governorate?: string;
    consultation_fee?: number;
    bio?: string;
}

export interface HospitalRegistrationDTO {
    email: string;
    password: string;
    phone?: string;
    hospital_name: string;
    registration_number: string;
    hospital_type?: string;
    address: string;
    city: string;
    governorate: string;
    phone_numbers?: string[];
    emergency_phone?: string;
    website_url?: string;
    total_beds?: number;
}

export interface VolunteerRegistrationDTO {
    email: string;
    password: string;
    phone?: string;
    full_name: string;
    national_id: string;
    date_of_birth?: string;
    gender?: string;
    address?: string;
    city?: string;
    governorate?: string;
    skills?: string[];
    languages?: string[];
    bio?: string;
}

export interface PharmacyRegistrationDTO {
    email: string;
    password: string;
    phone?: string;
    pharmacy_name: string;
    license_number: string;
    pharmacist_name: string;
    address: string;
    city: string;
    governorate: string;
    phone_numbers?: string[];
    delivery_available?: boolean;
    online_ordering?: boolean;
}

export interface LabRegistrationDTO {
    email: string;
    password: string;
    phone?: string;
    lab_name: string;
    license_number: string;
    lab_director_name: string;
    address: string;
    city: string;
    governorate: string;
    phone_numbers?: string[];
    home_service_available?: boolean;
    average_turnaround_time?: string;
}

// Login DTO
export interface LoginDTO {
    email: string;
    password: string;
}

// Response Types
export interface AuthResponse {
    user: AuthUser;
    profile: Doctor | Hospital | Volunteer | Pharmacy | Lab;
    token?: string;
}
