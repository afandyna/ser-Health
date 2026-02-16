import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Check, X, Eye, Trash2 } from "lucide-react";
import { Doctor } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";
import { getUsersByType, verifyUser, updateUserStatus, updateUserProfile, deleteUserProfile } from "@/lib/api";


const DoctorsManagement = () => {
    const { toast } = useToast();
    const [doctors, setDoctors] = useState<any[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch doctors from Supabase
    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const data = await getUsersByType('doctor');
            setDoctors(data);
        } catch (error: any) {
            toast({
                title: "خطأ",
                description: "فشل تحميل البيانات",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (doctor: any) => {
        try {
            await verifyUser('doctor', doctor.id);
            toast({
                title: "تم الموافقة ✅",
                description: "تم الموافقة على الطبيب بنجاح",
            });
            fetchDoctors(); // Refresh data
        } catch (error: any) {
            toast({
                title: "خطأ",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleReject = async (doctor: any) => {
        try {
            await updateUserStatus(doctor.auth_user_id, 'rejected');
            toast({
                title: "تم الرفض",
                description: "تم رفض الطبيب",
            });
            fetchDoctors(); // Refresh data
        } catch (error: any) {
            toast({
                title: "خطأ",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleUpdate = async () => {
        if (!selectedDoctor) return;
        try {
            const { auth_users, created_at, updated_at, ...updateData } = selectedDoctor;
            await updateUserProfile('doctor', selectedDoctor.id, updateData);
            toast({
                title: "تم التحديث",
                description: "تم تحديث بيانات الطبيب بنجاح",
            });
            fetchDoctors(); // Refresh data
            setEditMode(false);
        } catch (error: any) {
            toast({
                title: "خطأ",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (doctor: any) => {
        if (!confirm('هل أنت متأكد من حذف هذا الطبيب؟')) return;
        try {
            await deleteUserProfile('doctor', doctor.id, doctor.auth_user_id);
            toast({
                title: "تم الحذف",
                description: "تم حذف الطبيب نهائياً",
            });
            fetchDoctors();
        } catch (error: any) {
            toast({
                title: "خطأ",
                description: error.message,
                variant: "destructive",
            });
        }
    };



    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>الاسم</TableHead>
                            <TableHead>التخصص</TableHead>
                            <TableHead>المدينة</TableHead>
                            <TableHead>رقم الترخيص</TableHead>
                            <TableHead>الحالة</TableHead>
                            <TableHead>الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {doctors.map((doctor) => (
                            <TableRow key={doctor.id}>
                                <TableCell className="font-medium">{doctor.full_name}</TableCell>
                                <TableCell>{doctor.specialization}</TableCell>
                                <TableCell>{doctor.city}</TableCell>
                                <TableCell>{doctor.license_number}</TableCell>
                                <TableCell>
                                    <Badge variant={doctor.verified ? "default" : "secondary"}>
                                        {doctor.verified ? "موثق" : "قيد المراجعة"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" onClick={() => setSelectedDoctor(doctor)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>تفاصيل الطبيب</DialogTitle>
                                                    <DialogDescription>عرض وتعديل بيانات الطبيب</DialogDescription>
                                                </DialogHeader>
                                                {selectedDoctor && (
                                                    <div className="grid gap-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <Label>الاسم الكامل</Label>
                                                                <Input
                                                                    value={selectedDoctor.full_name}
                                                                    disabled={!editMode}
                                                                    onChange={(e) => setSelectedDoctor({ ...selectedDoctor, full_name: e.target.value })}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>التخصص</Label>
                                                                <Input
                                                                    value={selectedDoctor.specialization}
                                                                    disabled={!editMode}
                                                                    onChange={(e) => setSelectedDoctor({ ...selectedDoctor, specialization: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <Label>رقم الترخيص</Label>
                                                                <Input value={selectedDoctor.license_number} disabled />
                                                            </div>
                                                            <div>
                                                                <Label>سنوات الخبرة</Label>
                                                                <Input
                                                                    type="number"
                                                                    value={selectedDoctor.years_of_experience || ""}
                                                                    disabled={!editMode}
                                                                    onChange={(e) => setSelectedDoctor({ ...selectedDoctor, years_of_experience: Number(e.target.value) })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <Label>المحافظة</Label>
                                                                <Input
                                                                    value={selectedDoctor.governorate || ""}
                                                                    disabled={!editMode}
                                                                    onChange={(e) => setSelectedDoctor({ ...selectedDoctor, governorate: e.target.value })}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>المدينة</Label>
                                                                <Input
                                                                    value={selectedDoctor.city || ""}
                                                                    disabled={!editMode}
                                                                    onChange={(e) => setSelectedDoctor({ ...selectedDoctor, city: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <Label>خط العرض (Latitude)</Label>
                                                                <Input
                                                                    type="number"
                                                                    step="any"
                                                                    value={selectedDoctor.latitude || ""}
                                                                    disabled={!editMode}
                                                                    onChange={(e) => setSelectedDoctor({ ...selectedDoctor, latitude: Number(e.target.value) })}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>خط الطول (Longitude)</Label>
                                                                <Input
                                                                    type="number"
                                                                    step="any"
                                                                    value={selectedDoctor.longitude || ""}
                                                                    disabled={!editMode}
                                                                    onChange={(e) => setSelectedDoctor({ ...selectedDoctor, longitude: Number(e.target.value) })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <Label>عنوان العيادة</Label>
                                                                <Input
                                                                    value={selectedDoctor.clinic_address || ""}
                                                                    disabled={!editMode}
                                                                    onChange={(e) => setSelectedDoctor({ ...selectedDoctor, clinic_address: e.target.value })}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>رقم الهاتف</Label>
                                                                <Input
                                                                    value={selectedDoctor.phone || ""}
                                                                    disabled={!editMode}
                                                                    onChange={(e) => setSelectedDoctor({ ...selectedDoctor, phone: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Label>سعر الكشف</Label>
                                                            <Input
                                                                type="number"
                                                                value={selectedDoctor.consultation_fee || ""}
                                                                disabled={!editMode}
                                                                onChange={(e) => setSelectedDoctor({ ...selectedDoctor, consultation_fee: Number(e.target.value) })}
                                                            />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {editMode ? (
                                                                <>
                                                                    <Button onClick={handleUpdate}>حفظ التغييرات</Button>
                                                                    <Button variant="outline" onClick={() => setEditMode(false)}>إلغاء</Button>
                                                                </>
                                                            ) : (
                                                                <Button onClick={() => setEditMode(true)}>
                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                    تعديل
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </DialogContent>

                                        </Dialog>
                                        {!doctor.verified && (
                                            <>
                                                <Button variant="default" size="sm" onClick={() => handleApprove(doctor)}>
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleReject(doctor)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(doctor)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default DoctorsManagement;
