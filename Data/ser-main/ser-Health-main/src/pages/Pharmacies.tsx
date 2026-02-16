import { useMemo, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { calculateDistance } from "@/data/sampleData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Phone, Navigation, Pill, Search } from "lucide-react";
import { toast } from "sonner";
import { getVerifiedUsers } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { pharmacies as samplePharmacies } from "@/data/sampleData";

const Pharmacies = () => {
  const { t, lang } = useLanguage();
  const { position } = useGeolocation();
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", location: "", medicine: "", quantity: "" });

  useEffect(() => {
    const fetchPharmacies = async () => {
      let realData: any[] = [];
      try {
        realData = await getVerifiedUsers('pharmacy');
      } catch (error) {
        console.error("Error fetching pharmacies from database:", error);
      }

      const mappedSample = samplePharmacies.map(p => ({
        id: p.id,
        pharmacy_name: lang === 'ar' ? p.name_ar : p.name,
        address: lang === 'ar' ? p.address_ar : p.address,
        latitude: p.lat,
        longitude: p.lng,
        auth_users: { phone: p.phone },
        is_sample: true
      }));

      setPharmacies([...realData, ...mappedSample]);
      setLoading(false);
    };
    fetchPharmacies();
  }, [lang]);


  const list = useMemo(() => {
    return pharmacies
      .map((p) => ({
        ...p,
        distance: (position && p.latitude && p.longitude) ? calculateDistance(position.lat, position.lng, p.latitude, p.longitude) : 0,
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [position, pharmacies]);

  const validatePhone = (phone: string) => /^[\+]?[0-9\-\s]{7,15}$/.test(phone.trim());

  const handleSubmit = () => {
    if (!form.fullName.trim() || !form.phone.trim() || !form.location.trim() || !form.medicine.trim() || !form.quantity.trim()) {
      toast.error(lang === "ar" ? "يرجى ملء جميع الحقول" : "Please fill all fields");
      return;
    }
    if (!validatePhone(form.phone)) {
      toast.error(t("invalidPhone"));
      return;
    }
    toast.success(t("requestSentSuccess"));
    setModalOpen(false);
    setForm({ fullName: "", phone: "", location: "", medicine: "", quantity: "" });
  };

  return (
    <div className="container px-4 py-6 space-y-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Pill className="w-6 h-6 text-primary" />
        {t("pharmacies")}
      </h1>

      <Button onClick={() => setModalOpen(true)} className="w-full gap-2">
        <Search className="w-4 h-4" />
        {t("searchMissingMedicine")}
      </Button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("searchMissingMedicine")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>{t("fullName")} *</Label>
              <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>{t("phoneNumber")} *</Label>
              <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>{t("location")} *</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>{t("medicineName")} *</Label>
              <Input value={form.medicine} onChange={(e) => setForm({ ...form, medicine: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>{t("requiredQuantity")} *</Label>
              <Input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>{t("cancel")}</Button>
            <Button onClick={handleSubmit}>{t("submitRequest")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-3">
        {loading ? (
          [1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))
        ) : list.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            {t("noResults")}
          </div>
        ) : list.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{p.pharmacy_name}</p>
                  <p className="text-xs text-muted-foreground">{p.address}</p>
                </div>
                <Badge className={"bg-accent text-accent-foreground"}>
                  {t("open")}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {p.distance > 0 ? `${p.distance.toFixed(1)} ${t("kmAway")}` : p.city}
              </p>
              <div className="flex gap-2 pt-1">
                {p.auth_users.phone && (
                  <a href={`tel:${p.auth_users.phone}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full gap-1">
                      <Phone className="w-3 h-3" /> {t("call")}
                    </Button>
                  </a>
                )}
                {p.latitude && p.longitude && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button size="sm" variant="outline" className="w-full gap-1">
                      <Navigation className="w-3 h-3" /> {t("directions")}
                    </Button>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Pharmacies;

