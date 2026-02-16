import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { calculateDistance } from "@/data/sampleData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Navigation, Ambulance, Building2 } from "lucide-react";
import { getVerifiedUsers } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { hospitals as sampleHospitals } from "@/data/sampleData";

const statusColors: any = {
  available: "bg-accent text-accent-foreground",
  busy: "bg-warning text-warning-foreground",
  unavailable: "bg-destructive text-destructive-foreground",
  active: "bg-accent text-accent-foreground", // fallback for DB status
};

const Hospitals = () => {
  const { t, lang } = useLanguage();
  const { position } = useGeolocation();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";

  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>(statusFilter);

  useEffect(() => {
    const fetchHospitals = async () => {
      let realData: any[] = [];
      try {
        realData = await getVerifiedUsers('hospital');
      } catch (error) {
        console.error("Error fetching hospitals from database:", error);
      }

      const mappedRealData = realData.map(h => ({
        ...h,
        hospital_name: h.hospital_name,
        address: h.address,
        status: h.status || "available",
        emergency_phone: h.emergency_phone,
        auth_users: h.auth_users || { phone: h.phone }
      }));

      const mappedSample = sampleHospitals.map(h => ({
        ...h,
        hospital_name: lang === 'ar' ? h.name_ar : h.name,
        address: lang === 'ar' ? h.address_ar : h.address,
        latitude: h.lat,
        longitude: h.lng,
        status: h.status || "available",
        emergency_phone: h.ambulance,
        auth_users: { phone: h.phone },
        is_sample: true
      }));

      setHospitals([...mappedRealData, ...mappedSample]);
      setLoading(false);
    };
    fetchHospitals();
  }, [lang]);


  const list = useMemo(() => {
    let data = hospitals.map((h) => ({
      ...h,
      distance: (position && h.latitude && h.longitude) ? calculateDistance(position.lat, position.lng, h.latitude, h.longitude) : 0,
      currentStatus: h.status || "available"
    }));
    if (filter !== "all") data = data.filter((h) => h.currentStatus === filter);
    return data.sort((a, b) => a.distance - b.distance);
  }, [position, filter, hospitals]);

  return (
    <div className="container px-4 py-6 space-y-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Building2 className="w-6 h-6 text-primary" />
        {t("hospitals")}
      </h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {["all", "available", "busy", "unavailable"].map((s) => (
          <Button
            key={s}
            variant={filter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(s)}
          >
            {s === "all" ? t("all") : t(s as any)}
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
        ) : list.map((h) => (
          <Card key={h.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{h.hospital_name}</p>
                  <p className="text-xs text-muted-foreground">{h.address}</p>
                </div>
                <Badge className={statusColors[h.currentStatus]}>{t(h.currentStatus as any)}</Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {h.emergency_phone && (
                  <span className="flex items-center gap-1 text-accent">
                    <Ambulance className="w-3 h-3" /> {t("ambulance")}
                  </span>
                )}
                <span>{h.distance > 0 ? `${h.distance.toFixed(1)} ${t("kmAway")}` : h.city}</span>
              </div>
              <div className="flex gap-2 pt-1">
                {h.auth_users.phone && (
                  <a href={`tel:${h.auth_users.phone}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full gap-1">
                      <Phone className="w-3 h-3" /> {t("call")}
                    </Button>
                  </a>
                )}
                {h.latitude && h.longitude && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}`}
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

export default Hospitals;

