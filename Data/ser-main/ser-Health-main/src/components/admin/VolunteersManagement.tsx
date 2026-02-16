import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Eye, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUsersByType, verifyUser, updateUserStatus, updateUserProfile, deleteUserProfile } from "@/lib/api";

const VolunteersManagement = () => {
    const { toast } = useToast();
    const [volunteers, setVolunteers] = useState<any[]>([]);
    const [selectedVolunteer, setSelectedVolunteer] = useState<any | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const fetchVolunteers = async () => {
        try {
            const data = await getUsersByType('volunteer');
            setVolunteers(data);
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

    const handleApprove = async (volunteer: any) => {
        try {
            await verifyUser('volunteer', volunteer.id);
            toast({
                title: "تم الموافقة ✅",
                description: "تم الموافقة على المتطوع بنجاح",
            });
            fetchVolunteers();
        } catch (error: any) {
            toast({
                title: "خطأ",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleReject = async (volunteer: any) => {
        try {
            await updateUserStatus(volunteer.auth_user_id, 'rejected');
            toast({
                title: "تم الرفض",
                description: "تم رفض المتطوع",
            });
            fetchVolunteers();
        } catch (error: any) {
            toast({
                title: "خطأ",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleUpdate = async () => {
        if (!selectedVolunteer) return;
        try {
            const { auth_users, created_at, updated_at, ...updateData } = selectedVolunteer;
            await updateUserProfile('volunteer', selectedVolunteer.id, updateData);
            toast({
                title: "تم التحديث",
                description: "تم تحديث بيانات المتطوع بنجاح",
            });
            fetchVolunteers();
            setEditMode(false);
        } catch (error: any) {
            toast({
                title: "خطأ",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (volunteer: any) => {
        if (!confirm('هل أنت متأكد من حذف هذا المتطوع؟')) return;
        try {
            await deleteUserProfile('volunteer', volunteer.id, volunteer.auth_user_id);
            toast({
                title: "تم الحذف",
                description: "تم حذف المتطوع نهائياً",
            });
            fetchVolunteers();
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
                            <TableHead>الرقم القومي</TableHead>
                            <TableHead>المدينة</TableHead>
                            <TableHead>الحالة</TableHead>
                            <TableHead>الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {volunteers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    {loading ? "جاري التحميل..." : "لا يوجد متطوعين مسجلين"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            volunteers.map((volunteer) => (
                                <TableRow key={volunteer.id}>
                                    <TableCell className="font-medium">{volunteer.full_name}</TableCell>
                                    <TableCell>{volunteer.national_id}</TableCell>
                                    <TableCell>{volunteer.city}</TableCell>
                                    <TableCell>
                                        <Badge variant={volunteer.verified ? "default" : "secondary"}>
                                            {volunteer.verified ? "موثق" : "قيد المراجعة"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" onClick={() => setSelectedVolunteer(volunteer)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>تفاصيل المتطوع</DialogTitle>
                                                        <DialogDescription>عرض وتعديل بيانات المتطوع</DialogDescription>
                                                    </DialogHeader>
                                                    {selectedVolunteer && (
                                                        <div className="grid gap-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label>الاسم الكامل</Label>
                                                                    <Input
                                                                        value={selectedVolunteer.full_name}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedVolunteer({ ...selectedVolunteer, full_name: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>الرقم القومي</Label>
                                                                    <Input
                                                                        value={selectedVolunteer.national_id}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedVolunteer({ ...selectedVolunteer, national_id: e.target.value })}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label>المدينة</Label>
                                                                    <Input
                                                                        value={selectedVolunteer.city || ""}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedVolunteer({ ...selectedVolunteer, city: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>رقم الهاتف</Label>
                                                                    <Input
                                                                        value={selectedVolunteer.phone || ""}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedVolunteer({ ...selectedVolunteer, phone: e.target.value })}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label>خط العرض (Latitude)</Label>
                                                                    <Input
                                                                        type="number"
                                                                        step="any"
                                                                        value={selectedVolunteer.latitude || ""}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedVolunteer({ ...selectedVolunteer, latitude: Number(e.target.value) })}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>خط الطول (Longitude)</Label>
                                                                    <Input
                                                                        type="number"
                                                                        step="any"
                                                                        value={selectedVolunteer.longitude || ""}
                                                                        disabled={!editMode}
                                                                        onChange={(e) => setSelectedVolunteer({ ...selectedVolunteer, longitude: Number(e.target.value) })}
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
                                            {!volunteer.verified && (
                                                <>
                                                    <Button variant="default" size="sm" onClick={() => handleApprove(volunteer)}>
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="destructive" size="sm" onClick={() => handleReject(volunteer)}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(volunteer)}>
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

export default VolunteersManagement;

