import { supabase, hashPassword } from './supabase';
import {
    DoctorRegistrationDTO,
    HospitalRegistrationDTO,
    VolunteerRegistrationDTO,
    PharmacyRegistrationDTO,
    LabRegistrationDTO,
    LoginDTO,
    AuthResponse,
    UserType,
} from '@/types/database.types';

// --- 🛠️ Mock Database for Demo Mode ---
const MOCK_STORAGE_KEY = "ser_health_mock_db";
const getMockDB = () => {
    try {
        const db = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEY) || '{"verified": [], "deleted": [], "registrations": [], "edits": {}}');
        return {
            verified: db.verified || [],
            deleted: db.deleted || [],
            registrations: db.registrations || [],
            edits: db.edits || {}
        };
    } catch (e) {
        return { verified: [], deleted: [], registrations: [], edits: {} };
    }
};
const saveMockDB = (db: any) => localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(db));

// Register Doctor
export async function registerDoctor(data: DoctorRegistrationDTO): Promise<AuthResponse> {
    const passwordHash = await hashPassword(data.password);
    try {
        const { data: authUser, error: authError } = await supabase.from('auth_users').insert({
            email: data.email, password_hash: passwordHash, user_type: 'doctor', status: 'pending'
        }).select().single();
        if (authError) throw authError;
        const { error: profileError } = await supabase.from('doctors').insert({ ...data, auth_user_id: authUser.id, verified: false });
        if (profileError) throw profileError;
        return { user: authUser, profile: data as any };
    } catch (e) {
        const db = getMockDB();
        const newItem = {
            id: `dr-${Date.now()}`, ...data,
            type: 'doctor', verified: false,
            auth_users: { email: data.email, status: 'pending' }
        };
        db.registrations = [...(db.registrations || []), newItem];
        saveMockDB(db);
        return { user: newItem.auth_users as any, profile: newItem as any };
    }
}

// Register Hospital
export async function registerHospital(data: HospitalRegistrationDTO): Promise<AuthResponse> {
    const passwordHash = await hashPassword(data.password);
    try {
        const { data: authUser, error: authError } = await supabase.from('auth_users').insert({
            email: data.email, password_hash: passwordHash, user_type: 'hospital', status: 'pending'
        }).select().single();
        if (authError) throw authError;
        const { error: profileError } = await supabase.from('hospitals').insert({ ...data, auth_user_id: authUser.id, verified: false });
        if (profileError) throw profileError;
        return { user: authUser, profile: data as any };
    } catch (e) {
        const db = getMockDB();
        const newItem = {
            id: `hsp-${Date.now()}`, ...data,
            type: 'hospital', verified: false,
            auth_users: { email: data.email, status: 'pending' }
        };
        db.registrations = [...(db.registrations || []), newItem];
        saveMockDB(db);
        return { user: newItem.auth_users as any, profile: newItem as any };
    }
}

// Register Volunteer
export async function registerVolunteer(data: VolunteerRegistrationDTO): Promise<AuthResponse> {
    const passwordHash = await hashPassword(data.password);
    try {
        const { data: authUser, error: authError } = await supabase.from('auth_users').insert({
            email: data.email, password_hash: passwordHash, user_type: 'volunteer', status: 'pending'
        }).select().single();
        if (authError) throw authError;
        const { error: profileError } = await supabase.from('volunteers').insert({ ...data, auth_user_id: authUser.id, verified: false });
        if (profileError) throw profileError;
        return { user: authUser, profile: data as any };
    } catch (e) {
        const db = getMockDB();
        const newItem = {
            id: `vol-${Date.now()}`, ...data,
            type: 'volunteer', verified: false,
            auth_users: { email: data.email, status: 'pending' }
        };
        db.registrations = [...(db.registrations || []), newItem];
        saveMockDB(db);
        return { user: newItem.auth_users as any, profile: newItem as any };
    }
}

// Register Pharmacy
export async function registerPharmacy(data: PharmacyRegistrationDTO): Promise<AuthResponse> {
    const passwordHash = await hashPassword(data.password);
    try {
        const { data: authUser, error: authError } = await supabase.from('auth_users').insert({
            email: data.email, password_hash: passwordHash, user_type: 'pharmacy', status: 'pending'
        }).select().single();
        if (authError) throw authError;
        const { error: profileError } = await supabase.from('pharmacies').insert({ ...data, auth_user_id: authUser.id, verified: false });
        if (profileError) throw profileError;
        return { user: authUser, profile: data as any };
    } catch (e) {
        const db = getMockDB();
        const newItem = {
            id: `phr-${Date.now()}`, ...data,
            type: 'pharmacy', verified: false,
            auth_users: { email: data.email, status: 'pending' }
        };
        db.registrations = [...(db.registrations || []), newItem];
        saveMockDB(db);
        return { user: newItem.auth_users as any, profile: newItem as any };
    }
}

// Register Lab
export async function registerLab(data: LabRegistrationDTO): Promise<AuthResponse> {
    const passwordHash = await hashPassword(data.password);
    try {
        const { data: authUser, error: authError } = await supabase.from('auth_users').insert({
            email: data.email, password_hash: passwordHash, user_type: 'lab', status: 'pending'
        }).select().single();
        if (authError) throw authError;
        const { error: profileError } = await supabase.from('labs').insert({ ...data, auth_user_id: authUser.id, verified: false });
        if (profileError) throw profileError;
        return { user: authUser, profile: data as any };
    } catch (e) {
        const db = getMockDB();
        const newItem = {
            id: `lab-${Date.now()}`, ...data,
            type: 'lab', verified: false,
            auth_users: { email: data.email, status: 'pending' }
        };
        db.registrations = [...(db.registrations || []), newItem];
        saveMockDB(db);
        return { user: newItem.auth_users as any, profile: newItem as any };
    }
}

// Login
export async function login(data: LoginDTO): Promise<AuthResponse> {
    // 🛡️ Developer Bypass - يسمح بالدخول للأدمن للتجربة فقط
    const isDevAdmin = (data.email === "admin" && data.password === "admin") ||
        (data.email === "admin@ser-health.com" && data.password === "admin123");

    if (isDevAdmin) {
        console.log("Dev Bypass Triggered");
        return {
            user: {
                id: "00000000-0000-0000-0000-000000000000",
                email: "admin@ser-health.com",
                user_type: "admin",
                status: "active"
            } as any,
            profile: {
                full_name: "Super Admin (Dev Mode)",
                role: "super_admin"
            } as any
        };
    }

    const passwordHash = await hashPassword(data.password);

    // Get user from auth_users
    const { data: authUser, error: authError } = await supabase
        .from("auth_users")
        .select("*")
        .eq("email", data.email)
        .eq("password_hash", passwordHash)
        .single();

    if (authError || !authUser) {
        console.error("Login verification failed:", authError);
        throw new Error("Invalid email or password");
    }

    // Get profile based on user type
    let profile;
    let tableName: string;

    if (authUser.user_type === "pharmacy") {
        tableName = "pharmacies";
    } else if (authUser.user_type === "admin") {
        tableName = "admins";
    } else {
        tableName = `${authUser.user_type}s`;
    }

    const { data: profileData, error: profileError } = await supabase
        .from(tableName)
        .select("*")
        .eq("auth_user_id", authUser.id)
        .single();

    if (profileError) {
        console.warn("Profile fetch failed, using minimal profile:", profileError);
        profile = { full_name: authUser.email.split("@")[0] }; // Fallback
    } else {
        profile = profileData;
    }

    // Update last login (non-blocking)
    supabase
        .from("auth_users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", authUser.id)
        .then(({ error }) => { if (error) console.warn("Failed to update last login", error); });

    return { user: authUser, profile };
}

// Get all users by type (for admin)
export async function getUsersByType(userType: UserType) {
    let tableName: string;
    if (userType === "pharmacy") {
        tableName = "pharmacies";
    } else {
        tableName = `${userType}s`;
    }

    try {
        const { data, error } = await supabase
            .from(tableName)
            .select(`
                *,
                auth_users!inner(*)
            `)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.warn(`Database fetch failed for ${userType}, returning sample data:`, error);
        const { doctors, hospitals, pharmacies, labs, donations } = await import("@/data/sampleData");
        const db = getMockDB();
        let source: any[] = [];
        switch (userType) {
            case "doctor": source = doctors; break;
            case "hospital": source = hospitals; break;
            case "pharmacy": source = pharmacies; break;
            case "lab": source = labs; break;
            case "volunteer": source = donations; break;
        }

        const mockRegs = (db.registrations || []).filter((r: any) => r.type === userType).map(r => ({
            ...r,
            verified: db.verified.includes(r.id),
            auth_users: { ...r.auth_users, status: db.verified.includes(r.id) ? "active" : "pending" }
        }));

        const mappedSource = source.map(item => {
            const isVerified = db.verified.includes(item.id);
            const mockEdit = (db.edits || {})[item.id];
            return {
                ...item,
                ...(mockEdit || {}),
                id: item.id,
                full_name: (mockEdit?.full_name) || (item as any).name_ar || (item as any).hospital_name || (item as any).donor_name,
                specialization: (mockEdit?.specialization) || (item as any).specialty_ar,
                city: (mockEdit?.city) || (item as any).city || "المنصورة",
                verified: isVerified,
                auth_user_id: `auth-${item.id}`,
                auth_users: { email: "demo@example.com", status: isVerified ? "active" : "pending" }
            };
        });

        return [...mappedSource, ...mockRegs].filter(item => !db.deleted.includes(item.id));
    }
}

// Get verified users (for public website)
export async function getVerifiedUsers(userType: UserType) {
    const data = await getUsersByType(userType);
    return data.filter((u: any) => u.verified);
}

// Update user status (for admin)
export async function updateUserStatus(userId: string, status: "active" | "suspended" | "rejected") {
    try {
        const { error } = await supabase.from("auth_users").update({ status }).eq("id", userId);
        if (error) throw error;
    } catch (e) {
        const db = getMockDB();
        const profileId = userId.replace("auth-", "");

        if (status === "active") {
            if (!db.verified.includes(profileId)) {
                db.verified.push(profileId);
                if (db.registrations) {
                    db.registrations = db.registrations.map((r: any) =>
                        r.auth_user_id === userId ? { ...r, verified: true, auth_users: { ...r.auth_users, status: 'active' } } : r
                    );
                }
            }
        } else if (status === "rejected" || status === "suspended") {
            if (!db.deleted.includes(profileId)) {
                db.deleted.push(profileId);
            }
        }
        saveMockDB(db);
    }
    window.dispatchEvent(new CustomEvent('admin-refresh'));
    return true;
}

// Verify user (for admin)
export async function verifyUser(userType: UserType, profileId: string) {
    try {
        const tableName = userType === "pharmacy" ? "pharmacies" : `${userType}s`;
        const { error } = await supabase.from(tableName).update({ verified: true }).eq("id", profileId);
        if (error) throw error;

        const { data: profile } = await supabase.from(tableName).select("auth_user_id").eq("id", profileId).single();
        if (profile) await updateUserStatus(profile.auth_user_id, "active");
    } catch (e) {
        const db = getMockDB();
        if (!db.verified.includes(profileId)) {
            db.verified.push(profileId);
            // Also update any matching registration verified status
            if (db.registrations) {
                db.registrations = db.registrations.map((r: any) =>
                    r.id === profileId ? { ...r, verified: true, auth_users: { ...r.auth_users, status: 'active' } } : r
                );
            }
            saveMockDB(db);
        }
    }
    window.dispatchEvent(new CustomEvent('admin-refresh'));
    return true;
}

// Update user profile (for admin)
export async function updateUserProfile(userType: UserType, profileId: string, data: any) {
    let tableName: string;
    if (userType === "pharmacy") {
        tableName = "pharmacies";
    } else {
        tableName = `${userType}s`;
    }

    try {
        const { data: updatedData, error } = await supabase
            .from(tableName)
            .update(data)
            .eq("id", profileId)
            .select()
            .single();

        if (error) throw error;
        return updatedData;
    } catch (e) {
        const db = getMockDB();
        db.edits = { ...(db.edits || {}), [profileId]: data };
        saveMockDB(db);
        window.dispatchEvent(new CustomEvent('admin-refresh'));
        return { id: profileId, ...data };
    }
}
// Delete user profile and auth user
export async function deleteUserProfile(userType: UserType, profileId: string, authUserId: string) {
    try {
        const tableName = userType === "pharmacy" ? "pharmacies" : `${userType}s`;
        const { error: err1 } = await supabase.from(tableName).delete().eq("id", profileId);
        if (err1) throw err1;
        const { error: err2 } = await supabase.from("auth_users").delete().eq("id", authUserId);
        if (err2) throw err2;
    } catch (e) {
        console.warn("Deletion failed on server, using mock deletion:", e);
        const db = getMockDB();
        if (!db.deleted.includes(profileId)) {
            db.deleted.push(profileId);
            saveMockDB(db);
        }
    }
    window.dispatchEvent(new CustomEvent('admin-refresh'));
    return true;
}

// Get Admin Stats
export async function getAdminStats() {
    try {
        const fetchCount = async (table: string, verified: boolean | null = null) => {
            let query = supabase.from(table).select("*", { count: "exact", head: true });
            if (verified !== null) query = query.eq("verified", verified);
            const { count, error } = await query;
            if (error) throw error;
            return count || 0;
        };

        const [d, h, v, p, l] = await Promise.all([
            fetchCount("doctors"), fetchCount("hospitals"), fetchCount("volunteers"),
            fetchCount("pharmacies"), fetchCount("labs")
        ]);

        if (d + h + v + p + l === 0) throw new Error("Database is empty or not connected");

        const [pd, ph, pv, pp, pl] = await Promise.all([
            fetchCount("doctors", false), fetchCount("hospitals", false), fetchCount("volunteers", false),
            fetchCount("pharmacies", false), fetchCount("labs", false)
        ]);

        return {
            doctors: d, hospitals: h, volunteers: v, pharmacies: p, labs: l,
            pending: { doctor: pd, hospital: ph, volunteer: pv, pharmacy: pp, lab: pl }
        };
    } catch (error) {
        const { doctors, hospitals, pharmacies, labs, donations } = await import("@/data/sampleData");
        const db = getMockDB();

        const calc = (list: any[], type: string) => {
            const regs = (db.registrations || []).filter((r: any) => r.type === type);
            const combined = [...list, ...regs];
            const total = combined.filter(i => !db.deleted.includes(i.id)).length;
            const pending = combined.filter(i => !db.verified.includes(i.id) && !db.deleted.includes(i.id)).length;
            return { total, pending };
        };

        const d = calc(doctors, 'doctor');
        const h = calc(hospitals, 'hospital');
        const p = calc(pharmacies, 'pharmacy');
        const l = calc(labs, 'lab');
        const v = calc(donations, 'volunteer');

        return {
            doctors: d.total,
            hospitals: h.total,
            volunteers: v.total,
            pharmacies: p.total,
            labs: l.total,
            pending: {
                doctor: d.pending,
                hospital: h.pending,
                volunteer: v.pending,
                pharmacy: p.pending,
                lab: l.pending
            }
        };
    }
}

