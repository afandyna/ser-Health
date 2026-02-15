import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { DoctorRegistrationDTO } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";
import { registerDoctor } from "@/lib/api";
import { useGeolocation } from "@/hooks/useGeolocation";

interface DoctorRegistrationFormProps {
    onBack: () => void;
}

const DoctorRegistrationForm = ({ onBack }: DoctorRegistrationFormProps) => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { position } = useGeolocation();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<DoctorRegistrationDTO>({
        email: "",
        password: "",
        phone: "",
        full_name: "",
        specialization: "",
        license_number: "",
        years_of_experience: undefined,
        clinic_address: "",
        city: "",
        governorate: "",
        consultation_fee: undefined,
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
            await registerDoctor(finalData);

            toast({
                title: "تم إرسال الطلب بنجاح! ✅",
                description: "سيتم مراجعة طلبك والموافقة عليه من قبل الإدارة قريباً",
            });

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error: any) {
            toast({
                title: "حدث خطأ ❌",
                description: error.message || "فشل التسجيل، يرجى المحاولة مرة أخرى",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "years_of_experience" || name === "consultation_fee"
                ? (value ? Number(value) : undefined)
                : value
        }));
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ArrowLeft />
                    </Button>
                    <CardTitle className="text-2xl">تسجيل دكتور</CardTitle>
                </div>
                <CardDescription>
                    املأ البيانات التالية لإنشاء حساب دكتور
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        {/* Account Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">البريد الإلكتروني *</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="doctor@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">كلمة المرور *</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Personal Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="full_name">الاسم الكامل *</Label>
                                <Input
                                    id="full_name"
                                    name="full_name"
                                    placeholder="د. أحمد محمد"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">رقم الهاتف</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="01234567890"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Professional Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="specialization">التخصص *</Label>
                                <select
                                    id="specialization"
                                    name="specialization"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.specialization}
                                    onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                                    required
                                >
                                    <option value="">اختر التخصص...</option>
                                    <option value="باطنة">باطنة</option>
                                    <option value="باطنة">أمراض القلب</option>
                                    <option value="باطنة">الأمراض الجلدية</option>
                                    <option value="أطفال">طب الأطفال</option>
                                    <option value="عظام">جراحة العظام</option>
                                    <option value="عيون">طب العيون</option>
                                    <option value="نسا وتوليد">نسا وتوليد</option>
                                    <option value="مخ وأعصاب">مخ وأعصاب</option>
                                    <option value="نفسية">الطب النفسي</option>
                                    <option value="أنف وأذن وحنجرة">أنف وأذن وحنجرة</option>
                                    <option value="أسنان">طب الأسنان</option>
                                    <option value="أشعة">الأشعة</option>
                                    <option value="كلى">أمراض الكلى</option>
                                    <option value="جراحة عامة">جراحة عامة</option>
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="license_number">رقم الترخيص *</Label>
                                <Input
                                    id="license_number"
                                    name="license_number"
                                    placeholder="123456"
                                    value={formData.license_number}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="years_of_experience">سنوات الخبرة</Label>
                                <Input
                                    id="years_of_experience"
                                    name="years_of_experience"
                                    type="number"
                                    placeholder="5"
                                    value={formData.years_of_experience || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="consultation_fee">سعر الكشف (جنيه)</Label>
                                <Input
                                    id="consultation_fee"
                                    name="consultation_fee"
                                    type="number"
                                    placeholder="200"
                                    value={formData.consultation_fee || ""}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="governorate">المحافظة</Label>
                                <Input
                                    id="governorate"
                                    name="governorate"
                                    placeholder="القاهرة"
                                    value={formData.governorate}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="city">المدينة</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    placeholder="مدينة نصر"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2 md:col-span-1">
                                <Label htmlFor="clinic_address">عنوان العيادة</Label>
                                <Input
                                    id="clinic_address"
                                    name="clinic_address"
                                    placeholder="شارع..."
                                    value={formData.clinic_address}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="grid gap-2">
                            <Label htmlFor="bio">نبذة عنك</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                placeholder="اكتب نبذة مختصرة عن خبراتك..."
                                value={formData.bio}
                                onChange={handleChange}
                                rows={4}
                            />
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

export default DoctorRegistrationForm;
