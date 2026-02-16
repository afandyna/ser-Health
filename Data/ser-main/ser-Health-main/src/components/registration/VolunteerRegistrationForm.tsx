import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VolunteerRegistrationDTO } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";
import { registerVolunteer } from "@/lib/api";
import { useGeolocation } from "@/hooks/useGeolocation";

interface VolunteerRegistrationFormProps {
    onBack: () => void;
}

const VolunteerRegistrationForm = ({ onBack }: VolunteerRegistrationFormProps) => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { position } = useGeolocation();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<VolunteerRegistrationDTO>({
        email: "",
        password: "",
        phone: "",
        full_name: "",
        national_id: "",
        date_of_birth: "",
        gender: "",
        address: "",
        city: "",
        governorate: "",
        skills: [],
        languages: [],
        bio: "",
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
            await registerVolunteer(finalData);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ArrowLeft />
                    </Button>
                    <CardTitle className="text-2xl">تسجيل متطوع</CardTitle>
                </div>
                <CardDescription>املأ البيانات التالية لإنشاء حساب متطوع</CardDescription>
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
                                <Label htmlFor="full_name">الاسم الكامل *</Label>
                                <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="national_id">الرقم القومي *</Label>
                                <Input id="national_id" name="national_id" value={formData.national_id} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="date_of_birth">تاريخ الميلاد</Label>
                                <Input id="date_of_birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="gender">النوع</Label>
                                <Input id="gender" name="gender" placeholder="ذكر/أنثى" value={formData.gender} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">رقم الهاتف</Label>
                                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address">العنوان</Label>
                            <Input id="address" name="address" value={formData.address} onChange={handleChange} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="governorate">المحافظة</Label>
                                <Input id="governorate" name="governorate" value={formData.governorate} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="city">المدينة</Label>
                                <Input id="city" name="city" value={formData.city} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="bio">نبذة عنك</Label>
                            <Textarea id="bio" name="bio" placeholder="اكتب نبذة مختصرة..." value={formData.bio} onChange={handleChange} rows={4} />
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

export default VolunteerRegistrationForm;
