import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Check, X, Eye, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUsersByType, verifyUser, updateUserStatus, updateUserProfile, deleteUserProfile } from "@/lib/api";

const HospitalsManagement = () => {
    const { toast } = useToast();
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [selectedHospital, setSelectedHospital] = useState<any | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = async () => {
        try {
            const data = await getUsersByType('hospital');
            setHospitals(data);
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

    const handleApprove = async (hospital: any) => {
        try {
            await verifyUser('hospital', hospital.id);
            toast({
                title: "تم الموافقة ✅",
                description: "تم الموافقة على المستشفى بنجاح",
            });
            fetchHospitals();
        } catch (error: any) {
            toast({
                title: "خطأ",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleReject = async (hospital: any) => {
        try {
            await updateUserStatus(hospital.auth_user_id, 'rejected');
            toast({
                title: "تم الرفض",
                description: "تم رفض المستشفى",
            });
            fetchHospitals();
        } catch (error: any) {
            toast({
                title: "خطأ",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleUpdate = async () => {
        if (!selectedHospital) return;
        try {
            const { auth_users, created_at, updated_at, ...updateData } = selectedHospital;
            await updateUserProfile('hospital', selectedHospital.id, updateData);
            toast({
                title: "تم التحديث",
                description: "تم تحديث بيانات المستشفى بنجاح",
            });
            fetchHospitals();
            setEditMode(false);
        } catch (error: any) {
            toast({
                title: "خطأ",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (hospital: any) => {
        if (!confirm('هل أنت متأكد من حذف هذا المستشفى؟')) return;
        try {
            await deleteUserProfile('hospital', hospital.id, hospital.auth_user_id);
            toast({
                title: "تم الحذف",
                description: "تم حذف المستشفى نهائياً",
            });
            fetchHospitals();
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
                            <TableHead>اسم المستشفى</TableHead>
                            <TableHead>النوع</TableHead>
                            <TableHead>المدينة</TableHead>
                            <TableHead>رقم التسجيل</TableHead>
                            <TableHead>الحالة</TableHead>
                            <TableHead>الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {hospitals.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground">
                                    {loading ? "جاري التحميل..." : "لا توجد مستشفيات مسجلة"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            hospitals.map((hospital) => (
                                <TableRow key={hospital.id}>
                                    <TableCell className="font-medium">{hospital.hospital_name}</TableCell>
                                    <TableCell>{hospital.hospital_type}</TableCell>
                                    <TableCell>{hospital.city}</TableCell>
                                    <TableCell>{hospital.registration_number}</TableCell>
                                    <TableCell>
                                        <Badge variant={hospital.verified ? "default" : "secondary"}>
                                            {hospital.verified ? "موثق" : "قيد المراجعة"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" onClick={() => setSelectedHospital(hospital)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>تفاصيل المستشفى</DialogTitle>
                                                        <DialogDescription>عرض وتعديل بيانات المستشفى</DialogDescription>
                                                    </DialogHeader>
                                                    {selectedHospital && (
                                                        <div className="grid gap-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label>اسم المستشفى</Label>
                                                                    <Input
                                                                        value={selectedHospital.hospital_name}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedHospital({ ...selectedHospital, hospital_name: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>النوع</Label>
                                                                    <Input
                                                                        value={selectedHospital.hospital_type}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedHospital({ ...selectedHospital, hospital_type: e.target.value })}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label>العنوان</Label>
                                                                    <Input
                                                                        value={selectedHospital.address || ""}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedHospital({ ...selectedHospital, address: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>رقم الهاتف</Label>
                                                                    <Input
                                                                        value={selectedHospital.phone || ""}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedHospital({ ...selectedHospital, phone: e.target.value })}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label>خط العرض (Latitude)</Label>
                                                                    <Input
                                                                        type="number"
                                                                        step="any"
                                                                        value={selectedHospital.latitude || ""}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedHospital({ ...selectedHospital, latitude: Number(e.target.value) })}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>خط الطول (Longitude)</Label>
                                                                    <Input
                                                                        type="number"
                                                                        step="any"
                                                                        value={selectedHospital.longitude || ""}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedHospital({ ...selectedHospital, longitude: Number(e.target.value) })}
                                                                    />
                                                                </div>
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
                                            {!hospital.verified && (
                                                <>
                                                    <Button variant="default" size="sm" onClick={() => handleApprove(hospital)}>
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="destructive" size="sm" onClick={() => handleReject(hospital)}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(hospital)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default HospitalsManagement;

