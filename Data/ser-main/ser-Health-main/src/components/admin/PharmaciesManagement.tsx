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

const PharmaciesManagement = () => {
    const { toast } = useToast();
    const [pharmacies, setPharmacies] = useState<any[]>([]);
    const [selectedPharmacy, setSelectedPharmacy] = useState<any | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPharmacies();
    }, []);

    const fetchPharmacies = async () => {
        try {
            const data = await getUsersByType('pharmacy');
            setPharmacies(data);
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

    const handleApprove = async (pharmacy: any) => {
        try {
            await verifyUser('pharmacy', pharmacy.id);
            toast({
                title: "تم الموافقة ✅",
                description: "تم الموافقة على الصيدلية بنجاح",
            });
            fetchPharmacies();
        } catch (error: any) {
            toast({
                title: "خطأ",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleReject = async (pharmacy: any) => {
        try {
            await updateUserStatus(pharmacy.auth_user_id, 'rejected');
            toast({
                title: "تم الرفض",
                description: "تم رفض الصيدلية",
            });
            fetchPharmacies();
        } catch (error: any) {
            toast({
                title: "خطأ",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleUpdate = async () => {
        if (!selectedPharmacy) return;
        try {
            const { auth_users, created_at, updated_at, ...updateData } = selectedPharmacy;
            await updateUserProfile('pharmacy', selectedPharmacy.id, updateData);
            toast({
                title: "تم التحديث",
                description: "تم تحديث بيانات الصيدلية بنجاح",
            });
            fetchPharmacies();
            setEditMode(false);
        } catch (error: any) {
            toast({
                title: "خطأ",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (pharmacy: any) => {
        if (!confirm('هل أنت متأكد من حذف هذه الصيدلية؟')) return;
        try {
            await deleteUserProfile('pharmacy', pharmacy.id, pharmacy.auth_user_id);
            toast({
                title: "تم الحذف",
                description: "تم حذف الصيدلية نهائياً",
            });
            fetchPharmacies();
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
                            <TableHead>اسم الصيدلية</TableHead>
                            <TableHead>الصيدلي</TableHead>
                            <TableHead>المدينة</TableHead>
                            <TableHead>الحالة</TableHead>
                            <TableHead>الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pharmacies.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    {loading ? "جاري التحميل..." : "لا توجد صيدليات مسجلة"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            pharmacies.map((pharmacy) => (
                                <TableRow key={pharmacy.id}>
                                    <TableCell className="font-medium">{pharmacy.pharmacy_name}</TableCell>
                                    <TableCell>{pharmacy.pharmacist_name}</TableCell>
                                    <TableCell>{pharmacy.city}</TableCell>
                                    <TableCell>
                                        <Badge variant={pharmacy.verified ? "default" : "secondary"}>
                                            {pharmacy.verified ? "موثق" : "قيد المراجعة"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" onClick={() => setSelectedPharmacy(pharmacy)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>تفاصيل الصيدلية</DialogTitle>
                                                        <DialogDescription>عرض وتعديل بيانات الصيدلية</DialogDescription>
                                                    </DialogHeader>
                                                    {selectedPharmacy && (
                                                        <div className="grid gap-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label>اسم الصيدلية</Label>
                                                                    <Input
                                                                        value={selectedPharmacy.pharmacy_name}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedPharmacy({ ...selectedPharmacy, pharmacy_name: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>اسم الصيدلي المسؤول</Label>
                                                                    <Input
                                                                        value={selectedPharmacy.pharmacist_name}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedPharmacy({ ...selectedPharmacy, pharmacist_name: e.target.value })}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label>العنوان</Label>
                                                                    <Input
                                                                        value={selectedPharmacy.address || ""}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedPharmacy({ ...selectedPharmacy, address: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>رقم الهاتف</Label>
                                                                    <Input
                                                                        value={selectedPharmacy.phone || ""}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedPharmacy({ ...selectedPharmacy, phone: e.target.value })}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label>خط العرض (Latitude)</Label>
                                                                    <Input
                                                                        type="number"
                                                                        step="any"
                                                                        value={selectedPharmacy.latitude || ""}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedPharmacy({ ...selectedPharmacy, latitude: Number(e.target.value) })}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>خط الطول (Longitude)</Label>
                                                                    <Input
                                                                        type="number"
                                                                        step="any"
                                                                        value={selectedPharmacy.longitude || ""}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedPharmacy({ ...selectedPharmacy, longitude: Number(e.target.value) })}
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
                                            {!pharmacy.verified && (
                                                <>
                                                    <Button variant="default" size="sm" onClick={() => handleApprove(pharmacy)}>
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="destructive" size="sm" onClick={() => handleReject(pharmacy)}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(pharmacy)}>
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

export default PharmaciesManagement;

