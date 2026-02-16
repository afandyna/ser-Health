import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { calculateDistance } from "@/data/sampleData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Phone, Navigation, FlaskConical, Star, Eye, Clock, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { getVerifiedUsers } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { labs as sampleLabs } from "@/data/sampleData";

const Labs = () => {
  const { t, lang } = useLanguage();
  const { position } = useGeolocation();
  const [searchParams] = useSearchParams();
  const testFilter = searchParams.get("test") || "";

  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(testFilter);
  const [bookingLab, setBookingLab] = useState<string | null>(null);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [bookForm, setBookForm] = useState({ fullName: "", phone: "", date: "", time: "" });

  useEffect(() => {
    const fetchLabs = async () => {
      let realData: any[] = [];
      try {
        realData = await getVerifiedUsers('lab');
      } catch (error) {
        console.error("Error fetching labs from database:", error);
      }

      const mappedRealData = realData.map(l => ({
        ...l,
        lab_name: l.lab_name,
        address: l.address,
        available_tests: l.available_tests || [],
        auth_users: l.auth_users || { phone: l.phone }
      }));

      const mappedSample = sampleLabs.map(l => ({
        ...l,
        lab_name: lang === 'ar' ? l.name_ar : l.name,
        address: lang === 'ar' ? l.address_ar : l.address,
        latitude: l.lat,
        longitude: l.lng,
        available_tests: (lang === 'ar' ? l.available_tests_ar : l.available_tests) || [],
        auth_users: { phone: l.phone },
        is_sample: true
      }));

      setLabs([...mappedRealData, ...mappedSample]);
      setLoading(false);
    };
    fetchLabs();
  }, [lang]);


  const allTestTypes = useMemo(() => {
    const tests = new Set<string>();
    labs.forEach(l => {
      const available = Array.isArray(l.available_tests) ? l.available_tests : [];
      available.forEach((t: string) => tests.add(t));
    });
    return Array.from(tests);
  }, [labs]);

  const list = useMemo(() => {
    let data = labs.map((l) => ({
      ...l,
      distance: (position && l.latitude && l.longitude) ? calculateDistance(position.lat, position.lng, l.latitude, l.longitude) : 0,
    }));

    if (filter) {
      const q = filter.trim().toLowerCase();
      data = data.filter(l => {
        const tests = (l.available_tests || []).map((t: string) => t.toLowerCase());
        // Also check Arabic/English originals if available on the object
        const testsAr = (l.available_tests_ar || []).map((t: string) => t.toLowerCase());
        const testsEn = (l.available_tests_en || []).map((t: string) => t.toLowerCase());
        const allTests = [...tests, ...testsAr, ...testsEn];

        return allTests.some(t => t.includes(q) || q.includes(t));
      });
    }

    return data.sort((a, b) => a.distance - b.distance);
  }, [position, labs, filter]);

  const currentLab = list.find((l) => l.id === bookingLab);

  const validatePhone = (phone: string) => /^[\+]?[0-9\-\s]{7,15}$/.test(phone.trim());

  const toggleTest = (test: string) => {
    setSelectedTests((prev) => prev.includes(test) ? prev.filter((t) => t !== test) : [...prev, test]);
  };

  const handleBooking = () => {
    if (!bookForm.fullName.trim() || !bookForm.phone.trim() || !bookForm.date || !bookForm.time || (selectedTests.length === 0)) {
      toast.error(lang === "ar" ? "يرجى ملء جميع الحقول واختيار تحليل واحد على الأقل" : "Please fill all fields and select at least one test");
      return;
    }
    if (!validatePhone(bookForm.phone)) {
      toast.error(t("invalidPhone"));
      return;
    }
    toast.success(t("bookingConfirmed"));
    setBookingLab(null);
    setSelectedTests([]);
    setBookForm({ fullName: "", phone: "", date: "", time: "" });
  };

  return (
    <div className="container px-4 py-6 space-y-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <FlaskConical className="w-6 h-6 text-primary" />
        {t("labs")}
      </h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <Button variant={!filter ? "default" : "outline"} size="sm" onClick={() => setFilter("")}>
          {t("all")}
        </Button>
        {allTestTypes.map((type) => (
          <Button
            key={type}
            variant={filter === type ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(type)}
            className="whitespace-nowrap"
          >
            {type}
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
        ) : list.map((l) => (
          <Card key={l.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{l.lab_name}</p>
                  <p className="text-xs text-muted-foreground">{l.address}</p>
                </div>
                <Badge className={"bg-accent text-accent-foreground"}>
                  <Clock className="w-3 h-3 mr-1" />
                  {t("openNow")}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{l.distance > 0 ? `${l.distance.toFixed(1)} ${t("kmAway")}` : l.city}</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-warning text-warning" /> {l.rating || "5.0"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {(l.total_reviews || 10) * 5}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {(l.available_tests || []).map((test: string) => (
                  <Badge key={test} variant="secondary" className="text-xs">
                    {test}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                {l.auth_users.phone && (
                  <a href={`tel:${l.auth_users.phone}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full gap-1">
                      <Phone className="w-3 h-3" /> {t("call")}
                    </Button>
                  </a>
                )}
                {l.latitude && l.longitude && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${l.latitude},${l.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button size="sm" variant="outline" className="w-full gap-1">
                      <Navigation className="w-3 h-3" /> {t("directions")}
                    </Button>
                  </a>
                )}
                <Button
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => {
                    setBookingLab(l.id);
                    setSelectedTests([]);
                    setBookForm({ fullName: "", phone: "", date: "", time: "" });
                  }}
                >
                  <CalendarDays className="w-3 h-3" /> {t("book")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Booking Modal */}
      <Dialog open={!!bookingLab} onOpenChange={(open) => !open && setBookingLab(null)}>
        <DialogContent className="max-w-sm max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {t("bookAppointment")} - {currentLab ? currentLab.lab_name : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>{t("selectTests")} *</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                {currentLab && (currentLab.available_tests || []).map((test: string) => (
                  <div key={test} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedTests.includes(test)}
                      onCheckedChange={() => toggleTest(test)}
                    />
                    <Label className="font-normal text-sm">{test}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <Label>{t("fullName")} *</Label>
              <Input value={bookForm.fullName} onChange={(e) => setBookForm({ ...bookForm, fullName: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>{t("phoneNumber")} *</Label>
              <Input type="tel" value={bookForm.phone} onChange={(e) => setBookForm({ ...bookForm, phone: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>{t("selectDate")} *</Label>
              <Input type="date" value={bookForm.date} onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>{t("selectTime")} *</Label>
              <Input type="time" value={bookForm.time} onChange={(e) => setBookForm({ ...bookForm, time: e.target.value })} />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setBookingLab(null)}>{t("cancelBooking")}</Button>
            <Button onClick={handleBooking}>{t("confirmBooking")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Labs;

