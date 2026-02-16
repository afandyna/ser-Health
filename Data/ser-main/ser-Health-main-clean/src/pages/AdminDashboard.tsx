import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserType } from "@/types/database.types";
import DoctorsManagement from "@/components/admin/DoctorsManagement";
import HospitalsManagement from "@/components/admin/HospitalsManagement";
import VolunteersManagement from "@/components/admin/VolunteersManagement";
import PharmaciesManagement from "@/components/admin/PharmaciesManagement";
import LabsManagement from "@/components/admin/LabsManagement";
import { Stethoscope, Building2, Heart, Pill, FlaskConical } from "lucide-react";
import { getAdminStats } from "@/lib/api";


const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<UserType>("doctor");
    const [stats, setStats] = useState({
        doctors: 0,
        hospitals: 0,
        volunteers: 0,
        pharmacies: 0,
        labs: 0,
        pending: {
            doctor: 0,
            hospital: 0,
            volunteer: 0,
            pharmacy: 0,
            lab: 0,
        }
    });

    // Check if user is admin
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/login');
            return;
        }

        const user = JSON.parse(userStr);
        if (user.user_type !== 'admin') {
            navigate('/');
            return;
        }
    }, [navigate]);

    const fetchStats = async () => {
        try {
            const data = await getAdminStats();
            setStats(data as any);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    useEffect(() => {
        fetchStats();

        // Refresh when an action (verify/delete) is taken
        window.addEventListener('admin-refresh', fetchStats);

        // Polling as a fallback for demo mode
        const interval = setInterval(fetchStats, 3000);

        return () => {
            window.removeEventListener('admin-refresh', fetchStats);
            clearInterval(interval);
        };
    }, []);


    const tabsConfig = [
        { value: "doctor", label: "الأطباء", icon: Stethoscope, count: stats.doctors, pending: stats.pending?.doctor || 0 },
        { value: "hospital", label: "المستشفيات", icon: Building2, count: stats.hospitals, pending: stats.pending?.hospital || 0 },
        { value: "volunteer", label: "المتطوعين", icon: Heart, count: stats.volunteers, pending: stats.pending?.volunteer || 0 },
        { value: "pharmacy", label: "الصيدليات", icon: Pill, count: stats.pharmacies, pending: stats.pending?.pharmacy || 0 },
        { value: "lab", label: "المعامل", icon: FlaskConical, count: stats.labs, pending: stats.pending?.lab || 0 },
    ];

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">لوحة التحكم - الإدارة</h1>
                <p className="text-muted-foreground">إدارة جميع المستخدمين والموافقة على الطلبات</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {tabsConfig.map(({ value, label, icon: Icon, count, pending }) => (
                    <Card key={value} className="relative">
                        {pending > 0 && (
                            <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        )}
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{label}</CardTitle>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{count}</div>
                            {pending > 0 && (
                                <p className="text-xs text-red-500 font-medium">+{pending} طلب جديد</p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Management Tabs */}
            <Card>
                <CardContent className="pt-6">
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as UserType)}>
                        <TabsList className="grid w-full grid-cols-5">
                            {tabsConfig.map(({ value, label, icon: Icon, pending }) => (
                                <TabsTrigger key={value} value={value} className="flex items-center gap-2 relative">
                                    <Icon size={16} />
                                    <span className="hidden sm:inline">{label}</span>
                                    {pending > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                            {pending}
                                        </span>
                                    )}
                                </TabsTrigger>
                            ))}
                        </TabsList>


                        <TabsContent value="doctor" className="mt-6">
                            <DoctorsManagement />
                        </TabsContent>

                        <TabsContent value="hospital" className="mt-6">
                            <HospitalsManagement />
                        </TabsContent>

                        <TabsContent value="volunteer" className="mt-6">
                            <VolunteersManagement />
                        </TabsContent>

                        <TabsContent value="pharmacy" className="mt-6">
                            <PharmaciesManagement />
                        </TabsContent>

                        <TabsContent value="lab" className="mt-6">
                            <LabsManagement />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDashboard;
