import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserType } from "@/types/database.types";
import DoctorRegistrationForm from "@/components/registration/DoctorRegistrationForm";
import HospitalRegistrationForm from "@/components/registration/HospitalRegistrationForm";
import VolunteerRegistrationForm from "@/components/registration/VolunteerRegistrationForm";
import PharmacyRegistrationForm from "@/components/registration/PharmacyRegistrationForm";
import LabRegistrationForm from "@/components/registration/LabRegistrationForm";
import { Stethoscope, Building2, Heart, Pill, FlaskConical } from "lucide-react";

const Register = () => {
    const [selectedType, setSelectedType] = useState<UserType | null>(null);

    const userTypes = [
        { type: "doctor" as UserType, label: "دكتور", icon: Stethoscope, color: "bg-blue-500" },
        { type: "hospital" as UserType, label: "مستشفى", icon: Building2, color: "bg-green-500" },
        { type: "volunteer" as UserType, label: "متطوع", icon: Heart, color: "bg-red-500" },
        { type: "pharmacy" as UserType, label: "صيدلية", icon: Pill, color: "bg-purple-500" },
        { type: "lab" as UserType, label: "معمل", icon: FlaskConical, color: "bg-orange-500" },
    ];

    const renderRegistrationForm = () => {
        switch (selectedType) {
            case "doctor":
                return <DoctorRegistrationForm onBack={() => setSelectedType(null)} />;
            case "hospital":
                return <HospitalRegistrationForm onBack={() => setSelectedType(null)} />;
            case "volunteer":
                return <VolunteerRegistrationForm onBack={() => setSelectedType(null)} />;
            case "pharmacy":
                return <PharmacyRegistrationForm onBack={() => setSelectedType(null)} />;
            case "lab":
                return <LabRegistrationForm onBack={() => setSelectedType(null)} />;
            default:
                return null;
        }
    };

    if (selectedType) {
        return (
            <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
                <div className="w-full max-w-4xl">
                    {renderRegistrationForm()}
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-4xl">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl">إنشاء حساب جديد</CardTitle>
                        <CardDescription className="text-lg">
                            اختر نوع الحساب المناسب لك
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {userTypes.map(({ type, label, icon: Icon, color }) => (
                                <Button
                                    key={type}
                                    variant="outline"
                                    className="h-32 flex flex-col gap-3 hover:scale-105 transition-transform"
                                    onClick={() => setSelectedType(type)}
                                >
                                    <div className={`${color} p-4 rounded-full text-white`}>
                                        <Icon size={32} />
                                    </div>
                                    <span className="text-xl font-semibold">{label}</span>
                                </Button>
                            ))}
                        </div>
                        <div className="mt-6 text-center text-sm">
                            لديك حساب بالفعل؟{" "}
                            <a href="/login" className="underline underline-offset-4 hover:text-primary">
                                تسجيل الدخول
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Register;
