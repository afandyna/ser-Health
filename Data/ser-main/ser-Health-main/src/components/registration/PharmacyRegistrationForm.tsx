import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PharmacyRegistrationDTO } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";
import { registerPharmacy } from "@/lib/api";
import { useGeolocation } from "@/hooks/useGeolocation";

interface PharmacyRegistrationFormProps {
    onBack: () => void;
}

const PharmacyRegistrationForm = ({ onBack }: PharmacyRegistrationFormProps) => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { position } = useGeolocation();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<PharmacyRegistrationDTO>({
        email: "",
        password: "",
        phone: "",
        pharmacy_name: "",
        license_number: "",
        pharmacist_name: "",
        address: "",
        city: "",
        governorate: "",
        phone_numbers: [],
        delivery_available: false,
        online_ordering: false,
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
            await registerPharmacy(finalData);
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
                    <CardTitle className="text-2xl">تسجيل صيدلية</CardTitle>
                </div>
                <CardDescription>املأ البيانات التالية لإنشاء حساب صيدلية</CardDescription>
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
                                <Label htmlFor="pharmacy_name">اسم الصيدلية *</Label>
                                <Input id="pharmacy_name" name="pharmacy_name" value={formData.pharmacy_name} onChange={handleChange} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="pharmacist_name">اسم الصيدلي *</Label>
                                <Input id="pharmacist_name" name="pharmacist_name" value={formData.pharmacist_name} onChange={handleChange} required />
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

                        <div className="grid gap-2">
                            <Label htmlFor="phone">رقم الهاتف</Label>
                            <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                        </div>

                        <div className="flex items-center space-x-2 space-x-reverse">
                            <Checkbox
                                id="delivery_available"
                                checked={formData.delivery_available}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, delivery_available: checked as boolean }))}
                            />
                            <Label htmlFor="delivery_available" className="cursor-pointer">خدمة التوصيل متاحة</Label>
                        </div>

                        <div className="flex items-center space-x-2 space-x-reverse">
                            <Checkbox
                                id="online_ordering"
                                checked={formData.online_ordering}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, online_ordering: checked as boolean }))}
                            />
                            <Label htmlFor="online_ordering" className="cursor-pointer">الطلب أونلاين متاح</Label>
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

export default PharmacyRegistrationForm;
