import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { calculateDistance, addBooking, isSlotBooked } from "@/data/sampleData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Phone, Star, UserRound, Eye, Banknote } from "lucide-react";
import { toast } from "sonner";
import { getVerifiedUsers } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { doctors as sampleDoctors } from "@/data/sampleData";

const availabilityColors: Record<string, string> = {
  available: "bg-accent text-accent-foreground",
  busy: "bg-warning text-warning-foreground",
  offline: "bg-muted text-muted-foreground",
};

const Doctors = () => {
  const { t, lang } = useLanguage();
  const { position } = useGeolocation();
  const [searchParams] = useSearchParams();
  const specialtyFilter = searchParams.get("specialty") || "";

  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(specialtyFilter);
  const [bookingDoctor, setBookingDoctor] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [patientName, setPatientName] = useState("");

  useEffect(() => {
    // Only reset filter if it wasn't provided via URL param on initial mount
    if (!specialtyFilter) {
      setFilter("");
    }
    const fetchDoctors = async () => {
      let realData: any[] = [];
      try {
        realData = await getVerifiedUsers('doctor');
      } catch (error) {
        console.error("Error fetching doctors from database:", error);
      }

      const mappedRealData = realData.map(d => ({
        ...d,
        full_name: d.full_name,
        specialization: d.specialization,
        clinic_address: d.clinic_address,
        total_visits: d.visits || d.total_visits || 0,
        availability: d.status || d.availability || 'available',
        auth_users: d.auth_users || { phone: d.phone },
      }));

      const mappedSample = sampleDoctors.map(d => ({
        ...d,
        full_name: lang === 'ar' ? d.name_ar : d.name,
        specialization: lang === 'ar' ? d.specialty_ar : d.specialty,
        clinic_address: lang === 'ar' ? d.clinic_ar : d.clinic,
        latitude: d.lat,
        longitude: d.lng,
        total_visits: d.visits || 0,
        availability: d.availability || 'available',
        available_hours: d.available_slots,
        auth_users: { phone: d.phone },
        is_sample: true
      }));

      setDoctors([...mappedRealData, ...mappedSample]);
      setLoading(false);
    };
    fetchDoctors();
  }, [lang]);


  // Build specialty list - fixed with normalized comparison
  const specialties = useMemo(() => {
    const raw = doctors.map((d) => d.specialization?.trim()).filter(Boolean);
    const unique: string[] = [];
    const seen = new Set<string>();

    raw.forEach(s => {
      const lower = s.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        unique.push(s);
      }
    });

    return unique.map((s) => ({ name: s }));
  }, [doctors]);

  const list = useMemo(() => {
    let data = doctors.map((d) => ({
      ...d,
      distance: (position && d.latitude && d.longitude) ? calculateDistance(position.lat, position.lng, d.latitude, d.longitude) : 0,
    }));

    if (filter) {
      data = data.filter((d) =>
        d.specialization?.trim().toLowerCase() === filter.trim().toLowerCase()
      );
    }

    return data.sort((a, b) => {
      const avOrder = { available: 0, busy: 1, offline: 2 };
      const aAv = (a as any).availability || 'available';
      const bAv = (b as any).availability || 'available';
      const diff = (avOrder[aAv] || 0) - (avOrder[bAv] || 0);
      if (diff !== 0) return diff;
      return a.distance - b.distance;
    });
  }, [position, filter, doctors]);

  const handleBook = (doctorId: string) => {
    if (!patientName.trim() || !bookingDate || !bookingTime) {
      toast.error("Please fill all fields");
      return;
    }
    if (isSlotBooked(doctorId, bookingDate, bookingTime)) {
      toast.error(t("slotTaken"));
      return;
    }
    addBooking({ doctor_id: doctorId, patient_name: patientName, booking_date: bookingDate, booking_time: bookingTime, status: "confirmed" });
    toast.success(t("bookingConfirmed"));
    setBookingDoctor(null);
    setPatientName("");
    setBookingDate("");
    setBookingTime("");
  };

  return (
    <div className="container px-4 py-6 space-y-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <UserRound className="w-6 h-6 text-primary" />
        {t("doctors")}
      </h1>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <Button
          variant={!filter ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("")}
          className="whitespace-nowrap rounded-full px-4"
        >
          {t("all")}
        </Button>
        {specialties.map((s) => (
          <Button
            key={s.name}
            variant={filter.toLowerCase() === s.name.toLowerCase() ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(filter.toLowerCase() === s.name.toLowerCase() ? "" : s.name)}
            className="whitespace-nowrap rounded-full px-4"
          >
            {s.name}
          </Button>
        ))}
      </div>

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
        ) : list.map((d) => (
          <Card key={d.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{d.full_name}</p>
                  <p className="text-xs text-primary font-medium">
                    {d.specialization}
                  </p>
                  <p className="text-xs text-muted-foreground">{d.clinic_address}</p>

                  {/* Price Tag - User requested this */}
                  {d.consultation_fee && (
                    <div className="flex items-center gap-1 mt-1 text-accent font-semibold">
                      <Banknote className="w-4 h-4" />
                      <span className="text-xs">{t("consultationFee")}: {d.consultation_fee} {t("egp")}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="font-medium">{d.rating || "5.0"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="w-3 h-3" />
                    <span>{(d.total_visits || 0).toLocaleString()} {t("visits")}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {d.distance > 0 ? `${d.distance.toFixed(1)} ${t("kmAway")}` : d.city}
                </p>
                <Badge className={availabilityColors[d.availability || 'available']}>
                  {t((d.availability || 'available') as any)}
                </Badge>
              </div>
              <div className="flex gap-2 pt-1">
                {d.auth_users.phone && (
                  <a href={`tel:${d.auth_users.phone}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full gap-1">
                      <Phone className="w-3 h-3" /> {t("call")}
                    </Button>
                  </a>
                )}
                <Dialog open={bookingDoctor === d.id} onOpenChange={(open) => setBookingDoctor(open ? d.id : null)}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex-1 gap-1" disabled={d.availability === "offline"}>
                      {t("book")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm">
                    <DialogHeader>
                      <DialogTitle>{t("bookAppointment")} - {d.full_name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div className="text-xs text-muted-foreground">
                        <p className="font-medium mb-1">
                          {t("availableDays")}: {d.available_hours ? Object.keys(d.available_hours).join(", ") : "يومياً"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label>{t("patientName")}</Label>
                        <Input value={patientName} onChange={(e) => setPatientName(e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label>{t("selectDate")}</Label>
                        <Input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label>{t("selectTime")}</Label>
                        <div className="flex flex-wrap gap-1">
                          {["09:00", "10:00", "11:00", "12:00", "17:00", "18:00"].map((slot) => {
                            const taken = bookingDate && isSlotBooked(d.id, bookingDate, slot);
                            return (
                              <Button
                                key={slot}
                                size="sm"
                                variant={bookingTime === slot ? "default" : "outline"}
                                onClick={() => !taken && setBookingTime(slot)}
                                disabled={!!taken}
                                className="text-xs"
                              >
                                {slot}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                      <Button className="w-full" onClick={() => handleBook(d.id)}>
                        {t("confirmBooking")}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Doctors;

