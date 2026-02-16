import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HospitalRegistrationDTO } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";
import { registerHospital } from "@/lib/api";
import { useGeolocation } from "@/hooks/useGeolocation";

interface HospitalRegistrationFormProps {
    onBack: () => void;
}

const HospitalRegistrationForm = ({ onBack }: HospitalRegistrationFormProps) => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { position } = useGeolocation();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<HospitalRegistrationDTO>({
        email: "",
        password: "",
        phone: "",
        hospital_name: "",
        registration_number: "",
        hospital_type: "",
        address: "",
        city: "",
        governorate: "",
        phone_numbers: [],
        emergency_phone: "",
        website_url: "",
        total_beds: undefined,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const finalData = {
                ...formData,
                latitude: position?.lat,
                longitude: position?.lng,
            };
            await registerHospital(finalData);
            toast({
                title: "تم إرسال الطلب بنجاح! ✅",
                description: "سيتم مراجعة طلبك والموافقة عليه قريبًا",
            });
            setTimeout(() => navigate("/login"), 2000);
        } catch (error: any) {
            toast({
                title: "خطأ",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "total_beds" ? (value ? Number(value) : undefined) : value
        }));
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ArrowLeft />
                    </Button>
                    <CardTitle className="text-2xl">تسجيل مستشفى</CardTitle>
                </div>
                <CardDescription>املأ البيانات التالية لإنشاء حساب مستشفى</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">البريد الإلكتروني *</Label>
                                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">كلمة المرور *</Label>
                                <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="hospital_name">اسم المستشفى *</Label>
                                <Input id="hospital_name" name="hospital_name" value={formData.hospital_name} onChange={handleChange} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="registration_number">رقم التسجيل *</Label>
                                <Input id="registration_number" name="registration_number" value={formData.registration_number} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="hospital_type">نوع المستشفى</Label>
                                <Input id="hospital_type" name="hospital_type" placeholder="عام، خاص، تعليمي" value={formData.hospital_type} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="total_beds">عدد الأسرة</Label>
                                <Input id="total_beds" name="total_beds" type="number" value={formData.total_beds || ""} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address">العنوان *</Label>
                            <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="governorate">المحافظة *</Label>
                                <Input id="governorate" name="governorate" value={formData.governorate} onChange={handleChange} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="city">المدينة *</Label>
                                <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="phone">رقم الهاتف</Label>
                                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="emergency_phone">رقم الطوارئ</Label>
                                <Input id="emergency_phone" name="emergency_phone" type="tel" value={formData.emergency_phone} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="website_url">الموقع الإلكتروني</Label>
                            <Input id="website_url" name="website_url" type="url" value={formData.website_url} onChange={handleChange} />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "جاري التسجيل..." : "إنشاء حساب"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default HospitalRegistrationForm;
