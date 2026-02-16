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

const LabsManagement = () => {
    const { toast } = useToast();
    const [labs, setLabs] = useState<any[]>([]);
    const [selectedLab, setSelectedLab] = useState<any | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLabs();
    }, []);

    const fetchLabs = async () => {
        try {
            const data = await getUsersByType('lab');
            setLabs(data);
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

    const handleApprove = async (lab: any) => {
        try {
            await verifyUser('lab', lab.id);
            toast({
                title: "تم الموافقة ✅",
                description: "تم الموافقة على المعمل بنجاح",
            });
            fetchLabs();
        } catch (error: any) {
            toast({
                title: "خطأ",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleReject = async (lab: any) => {
        try {
            await updateUserStatus(lab.auth_user_id, 'rejected');
            toast({
                title: "تم الرفض",
                description: "تم رفض المعمل",
            });
            fetchLabs();
        } catch (error: any) {
            toast({
                title: "خطأ",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleUpdate = async () => {
        if (!selectedLab) return;
        try {
            const { auth_users, created_at, updated_at, ...updateData } = selectedLab;
            await updateUserProfile('lab', selectedLab.id, updateData);
            toast({
                title: "تم التحديث",
                description: "تم تحديث بيانات المعمل بنجاح",
            });
            fetchLabs();
            setEditMode(false);
        } catch (error: any) {
            toast({
                title: "خطأ",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (lab: any) => {
        if (!confirm('هل أنت متأكد من حذف هذا المعمل؟')) return;
        try {
            await deleteUserProfile('lab', lab.id, lab.auth_user_id);
            toast({
                title: "تم الحذف",
                description: "تم حذف المعمل نهائياً",
            });
            fetchLabs();
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
                            <TableHead>اسم المعمل</TableHead>
                            <TableHead>المدير</TableHead>
                            <TableHead>المدينة</TableHead>
                            <TableHead>الحالة</TableHead>
                            <TableHead>الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {labs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    {loading ? "جاري التحميل..." : "لا توجد معامل مسجلة"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            labs.map((lab) => (
                                <TableRow key={lab.id}>
                                    <TableCell className="font-medium">{lab.lab_name}</TableCell>
                                    <TableCell>{lab.lab_director_name}</TableCell>
                                    <TableCell>{lab.city}</TableCell>
                                    <TableCell>
                                        <Badge variant={lab.verified ? "default" : "secondary"}>
                                            {lab.verified ? "موثق" : "قيد المراجعة"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" onClick={() => setSelectedLab(lab)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>تفاصيل المعمل</DialogTitle>
                                                        <DialogDescription>عرض وتعديل بيانات المعمل</DialogDescription>
                                                    </DialogHeader>
                                                    {selectedLab && (
                                                        <div className="grid gap-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label>اسم المعمل</Label>
                                                                    <Input
                                                                        value={selectedLab.lab_name}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedLab({ ...selectedLab, lab_name: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>اسم المدير المسؤول</Label>
                                                                    <Input
                                                                        value={selectedLab.lab_director_name}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedLab({ ...selectedLab, lab_director_name: e.target.value })}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label>العنوان</Label>
                                                                    <Input
                                                                        value={selectedLab.address || ""}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedLab({ ...selectedLab, address: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>رقم الهاتف</Label>
                                                                    <Input
                                                                        value={selectedLab.phone || ""}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedLab({ ...selectedLab, phone: e.target.value })}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label>خط العرض (Latitude)</Label>
                                                                    <Input
                                                                        type="number"
                                                                        step="any"
                                                                        value={selectedLab.latitude || ""}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedLab({ ...selectedLab, latitude: Number(e.target.value) })}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>خط الطول (Longitude)</Label>
                                                                    <Input
                                                                        type="number"
                                                                        step="any"
                                                                        value={selectedLab.longitude || ""}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedLab({ ...selectedLab, longitude: Number(e.target.value) })}
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
                                            {!lab.verified && (
                                                <>
                                                    <Button variant="default" size="sm" onClick={() => handleApprove(lab)}>
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="destructive" size="sm" onClick={() => handleReject(lab)}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(lab)}>
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

export default LabsManagement;

