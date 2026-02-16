import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LabRegistrationDTO } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";
import { registerLab } from "@/lib/api";
import { useGeolocation } from "@/hooks/useGeolocation";

interface LabRegistrationFormProps {
    onBack: () => void;
}

const LabRegistrationForm = ({ onBack }: LabRegistrationFormProps) => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { position } = useGeolocation();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<LabRegistrationDTO>({
        email: "",
        password: "",
        phone: "",
        lab_name: "",
        license_number: "",
        lab_director_name: "",
        address: "",
        city: "",
        governorate: "",
        phone_numbers: [],
        home_service_available: false,
        average_turnaround_time: "",
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
            await registerLab(finalData);
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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ArrowLeft />
                    </Button>
                    <CardTitle className="text-2xl">تسجيل معمل</CardTitle>
                </div>
                <CardDescription>املأ البيانات التالية لإنشاء حساب معمل</CardDescription>
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
                                <Label htmlFor="lab_name">اسم المعمل *</Label>
                                <Input id="lab_name" name="lab_name" value={formData.lab_name} onChange={handleChange} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lab_director_name">اسم مدير المعمل *</Label>
                                <Input id="lab_director_name" name="lab_director_name" value={formData.lab_director_name} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="license_number">رقم الترخيص *</Label>
                            <Input id="license_number" name="license_number" value={formData.license_number} onChange={handleChange} required />
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
                                <Label htmlFor="average_turnaround_time">متوسط وقت التسليم</Label>
                                <Input id="average_turnaround_time" name="average_turnaround_time" placeholder="24 ساعة" value={formData.average_turnaround_time} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 space-x-reverse">
                            <Checkbox
                                id="home_service_available"
                                checked={formData.home_service_available}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, home_service_available: checked as boolean }))}
                            />
                            <Label htmlFor="home_service_available" className="cursor-pointer">خدمة منزلية متاحة</Label>
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

export default LabRegistrationForm;
