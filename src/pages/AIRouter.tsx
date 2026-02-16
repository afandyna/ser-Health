import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, AlertTriangle, Star, Eye, Phone, Navigation, FlaskConical, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { doctors, hospitals, labs, calculateDistance } from "@/data/sampleData";

interface AIResult {
  specialty: string;
  severity: "high" | "medium" | "low";
  nextStep: string;
  confidence: number;
  suggestedTests?: string[];
}

const availabilityColors: Record<string, string> = {
  available: "bg-accent text-accent-foreground",
  busy: "bg-warning text-warning-foreground",
  offline: "bg-muted text-muted-foreground",
};

const AIRouter = () => {
  const { t, lang } = useLanguage();
  const { position } = useGeolocation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);

  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [duration, setDuration] = useState("");
  const [painLevel, setPainLevel] = useState([5]);
  const [chronicDiseases, setChronicDiseases] = useState("");
  const [emergencyFlags, setEmergencyFlags] = useState({
    chestPain: false,
    breathingDifficulty: false,
    severeBleeding: false,
    lossOfConsciousness: false,
  });

  // Matching doctors based on result
  const matchingDoctors = useMemo(() => {
    if (!result) return [];
    const searchSpecialty = result.specialty.toLowerCase();
    return doctors
      .filter((d) =>
        d.specialty.toLowerCase().includes(searchSpecialty) ||
        searchSpecialty.includes(d.specialty.toLowerCase()) ||
        (d.specialty_ar && (d.specialty_ar.toLowerCase().includes(searchSpecialty) || searchSpecialty.includes(d.specialty_ar.toLowerCase())))
      )
      .map((d) => ({
        ...d,
        distance: position ? calculateDistance(position.lat, position.lng, d.lat, d.lng) : Infinity,
      }))
      .sort((a, b) => {
        if (!position) return 0;
        // First sort by distance
        const distanceDiff = a.distance - b.distance;
        if (Math.abs(distanceDiff) > 0.1) return distanceDiff;

        // Then by availability if distances are very similar
        const avOrder = { available: 0, busy: 1, offline: 2 };
        return (avOrder[a.availability] || 0) - (avOrder[b.availability] || 0);
      })
      .slice(0, 3);
  }, [result, position]);

  const matchingHospitals = useMemo(() => {
    if (!result) return [];
    const isEmergency = result.severity === "high";
    return hospitals
      .filter((h) => h.status !== "unavailable" && (!isEmergency || h.ambulance))
      .map((h) => ({
        ...h,
        distance: position ? calculateDistance(position.lat, position.lng, h.lat, h.lng) : 0,
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  }, [result, position]);

  const matchingLabs = useMemo(() => {
    if (!result?.suggestedTests?.length) return [];
    return labs
      .filter((l) =>
        result.suggestedTests!.some((test) => {
          const t = test.toLowerCase();
          return l.available_tests.some((lt) => lt.toLowerCase().includes(t)) ||
            l.available_tests_ar.some((lt) => lt.toLowerCase().includes(t));
        })
      )
      .map((l) => ({
        ...l,
        distance: position ? calculateDistance(position.lat, position.lng, l.lat, l.lng) : 0,
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  }, [result, position]);

  const getLocalAnalysis = (symptoms: string, lang: string): AIResult => {
    const s = symptoms.toLowerCase();
    const isAr = lang === "ar";

    // Eye/Vision conditions - العيون
    if (s.includes("eye") || s.includes("vision") || s.includes("sight") || s.includes("blind") ||
      s.includes("عين") || s.includes("عيني") || s.includes("عيوني") || s.includes("نظر") || s.includes("رؤية") ||
      s.includes("بصر") || s.includes("عمى") || s.includes("مش شايف") || s.includes("مش باشوف") ||
      s.includes("نظري ضعيف") || s.includes("عيني بتوجعني") || s.includes("حاجة في عيني") ||
      s.includes("احمرار") || s.includes("دموع") || s.includes("حرقان في العين")) {
      return {
        specialty: isAr ? "طب العيون" : "Ophthalmology",
        severity: "medium",
        nextStep: isAr ? "يرجى حجز موعد مع طبيب عيون لفحص النظر والعين" : "Please book an appointment with an ophthalmologist for a vision and eye checkup",
        confidence: 75,
        suggestedTests: isAr ? ["فحص حدة الإبصار", "قياس ضغط العين", "فحص قاع العين"] : ["Visual Acuity Test", "Tonometry", "Fundoscopy"]
      };
    }

    // Heart/Chest conditions - القلب والصدر
    if (s.includes("heart") || s.includes("chest pain") || s.includes("cardiac") || s.includes("palpitation") ||
      s.includes("قلب") || s.includes("قلبي") || s.includes("صدر") || s.includes("صدري") ||
      s.includes("خفقان") || s.includes("ألم الصدر") || s.includes("وجع في صدري") ||
      s.includes("قلبي بيوجعني") || s.includes("ضربات قلب") || s.includes("نبضي سريع") ||
      s.includes("ضيق في التنفس") || s.includes("مش قادر اتنفس") || s.includes("حاسس بضغط")) {
      return {
        specialty: isAr ? "أمراض القلب" : "Cardiology",
        severity: "high",
        nextStep: isAr ? "يجب استشارة طبيب قلب فوراً أو الذهاب للطوارئ إذا كان الألم شديداً" : "Consult a cardiologist immediately or go to the ER if pain is severe",
        confidence: 70,
        suggestedTests: isAr ? ["تخطيط قلب (ECG)", "إيكو", "إنزيمات القلب"] : ["ECG", "Echocardiogram", "Cardiac Enzymes"]
      };
    }

    // Bone/Joint/Orthopedic - العظام والمفاصل
    if (s.includes("bone") || s.includes("joint") || s.includes("fracture") || s.includes("sprain") || s.includes("back pain") ||
      s.includes("عظم") || s.includes("عظمة") || s.includes("عضمي") || s.includes("مفصل") ||
      s.includes("كسر") || s.includes("التواء") || s.includes("ظهر") || s.includes("ظهري") ||
      s.includes("ضهري") || s.includes("وجع في ضهري") || s.includes("رقبة") || s.includes("رقبتي") ||
      s.includes("ركبة") || s.includes("ركبتي") || s.includes("كتف") || s.includes("كتفي") ||
      s.includes("رجلي") || s.includes("ايدي") || s.includes("مش قادر امشي") || s.includes("مش قادر احرك")) {
      return {
        specialty: isAr ? "جراحة العظام" : "Orthopedics",
        severity: "medium",
        nextStep: isAr ? "يرجى زيارة طبيب عظام لعمل الفحوصات والأشعة اللازمة" : "Please visit an orthopedic surgeon for necessary examinations and X-rays",
        confidence: 80,
        suggestedTests: isAr ? ["أشعة X-Ray", "أشعة مقطعية", "رنين مغناطيسي"] : ["X-Ray", "CT Scan", "MRI"]
      };
    }

    // Skin/Dermatology - الجلدية
    if (s.includes("skin") || s.includes("rash") || s.includes("itch") || s.includes("acne") || s.includes("allerg") ||
      s.includes("جلد") || s.includes("جلدي") || s.includes("طفح") || s.includes("حكة") ||
      s.includes("حساسية") || s.includes("حب الشباب") || s.includes("حبوب") || s.includes("بقع") ||
      s.includes("هرش") || s.includes("بهرش") || s.includes("احمرار") || s.includes("التهاب") ||
      s.includes("اكزيما") || s.includes("صدفية") || s.includes("بثور") || s.includes("دمامل")) {
      return {
        specialty: isAr ? "الأمراض الجلدية" : "Dermatology",
        severity: "low",
        nextStep: isAr ? "استشر طبيب جلدية لفحص الحالة وتحديد العلاج المناسب" : "Consult a dermatologist to examine the condition and determine appropriate treatment",
        confidence: 85,
        suggestedTests: isAr ? ["خزعة جلدية", "اختبار حساسية"] : ["Skin Biopsy", "Allergy Test"]
      };
    }

    // Pediatrics - الأطفال
    if (s.includes("child") || s.includes("baby") || s.includes("infant") || s.includes("kid") ||
      s.includes("طفل") || s.includes("طفلي") || s.includes("ابني") || s.includes("بنتي") ||
      s.includes("رضيع") || s.includes("صغير") || s.includes("العيل") || s.includes("الولد") ||
      s.includes("البنت") || s.includes("الصغير") || s.includes("الصغيرة")) {
      return {
        specialty: isAr ? "طب الأطفال" : "Pediatrics",
        severity: "medium",
        nextStep: isAr ? "يجب عرض الطفل على طبيب أطفال متخصص" : "The child should be seen by a specialized pediatrician",
        confidence: 75,
        suggestedTests: isAr ? ["صورة دم كاملة (CBC)", "تحليل بول"] : ["Complete Blood Count (CBC)", "Urine Analysis"]
      };
    }

    // Dental - الأسنان
    if (s.includes("tooth") || s.includes("teeth") || s.includes("gum") || s.includes("dental") || s.includes("cavity") ||
      s.includes("سن") || s.includes("سنة") || s.includes("سناني") || s.includes("أسنان") ||
      s.includes("لثة") || s.includes("ضرس") || s.includes("ضروسي") || s.includes("تسوس") ||
      s.includes("وجع سناني") || s.includes("سناني بتوجعني") || s.includes("ضرسي بيوجعني") ||
      s.includes("التهاب اللثة") || s.includes("نزيف اللثة") || s.includes("خراج")) {
      return {
        specialty: isAr ? "طب الأسنان" : "Dentistry",
        severity: "medium",
        nextStep: isAr ? "يرجى زيارة طبيب أسنان في أقرب وقت" : "Please visit a dentist as soon as possible",
        confidence: 90,
        suggestedTests: isAr ? ["أشعة بانوراما", "أشعة سنية"] : ["Panoramic X-ray", "Dental X-ray"]
      };
    }

    // Respiratory/Lung - الصدر والتنفس
    if (s.includes("cough") || s.includes("breath") || s.includes("lung") || s.includes("asthma") || s.includes("pneumonia") ||
      s.includes("كحة") || s.includes("كحه") || s.includes("سعال") || s.includes("سعله") ||
      s.includes("تنفس") || s.includes("رئة") || s.includes("ربو") || s.includes("بكح") ||
      s.includes("مش قادر اتنفس") || s.includes("نفسي قصير") || s.includes("ضيق تنفس") ||
      s.includes("صدري") || s.includes("بلغم") || s.includes("خنقة") || s.includes("حساسية صدر")) {
      return {
        specialty: isAr ? "أمراض الرئة" : "Pulmonology",
        severity: "medium",
        nextStep: isAr ? "استشر طبيب صدر لفحص الجهاز التنفسي" : "Consult a pulmonologist for respiratory examination",
        confidence: 75,
        suggestedTests: isAr ? ["أشعة على الصدر", "اختبار وظائف الرئة"] : ["Chest X-ray", "Pulmonary Function Test"]
      };
    }

    // Stomach/Digestive - المعدة والجهاز الهضمي
    if (s.includes("stomach") || s.includes("abdomen") || s.includes("digest") || s.includes("nausea") || s.includes("diarrhea") ||
      s.includes("معدة") || s.includes("معدتي") || s.includes("بطن") || s.includes("بطني") ||
      s.includes("هضم") || s.includes("غثيان") || s.includes("إسهال") || s.includes("اسهال") ||
      s.includes("مغص") || s.includes("وجع في بطني") || s.includes("معدتي بتوجعني") ||
      s.includes("قيء") || s.includes("ترجيع") || s.includes("حرقان") || s.includes("حموضة") ||
      s.includes("امساك") || s.includes("انتفاخ") || s.includes("غازات") || s.includes("مش قادر اكل")) {
      return {
        specialty: isAr ? "الجهاز الهضمي" : "Gastroenterology",
        severity: "medium",
        nextStep: isAr ? "يرجى استشارة طبيب جهاز هضمي" : "Please consult a gastroenterologist",
        confidence: 70,
        suggestedTests: isAr ? ["منظار معدة", "سونار بطن", "تحليل براز"] : ["Endoscopy", "Abdominal Ultrasound", "Stool Analysis"]
      };
    }

    // Neurological - المخ والأعصاب
    if (s.includes("head") || s.includes("migraine") || s.includes("dizz") || s.includes("nerve") || s.includes("seizure") ||
      s.includes("رأس") || s.includes("راسي") || s.includes("دماغ") || s.includes("صداع") ||
      s.includes("دوخة") || s.includes("دوار") || s.includes("عصب") || s.includes("تشنج") ||
      s.includes("راسي بتوجعني") || s.includes("وجع في راسي") || s.includes("صداع نصفي") ||
      s.includes("دايخ") || s.includes("حاسس بدوخة") || s.includes("مش متوازن") ||
      s.includes("تنميل") || s.includes("خدر") || s.includes("رعشة") || s.includes("شلل")) {
      return {
        specialty: isAr ? "طب الأعصاب" : "Neurology",
        severity: "medium",
        nextStep: isAr ? "يجب استشارة طبيب مخ وأعصاب" : "You should consult a neurologist",
        confidence: 65,
        suggestedTests: isAr ? ["أشعة مقطعية على المخ", "رنين مغناطيسي", "رسم مخ"] : ["Brain CT Scan", "MRI", "EEG"]
      };
    }

    // ENT - أنف وأذن وحنجرة
    if (s.includes("ear") || s.includes("nose") || s.includes("throat") || s.includes("sinus") || s.includes("tonsil") ||
      s.includes("أذن") || s.includes("ودن") || s.includes("ودني") || s.includes("أنف") ||
      s.includes("منخير") || s.includes("حنجرة") || s.includes("زور") || s.includes("جيوب") ||
      s.includes("لوز") || s.includes("لوزتين") || s.includes("احتقان") || s.includes("التهاب") ||
      s.includes("ودني بتوجعني") || s.includes("زوري") || s.includes("صوتي") ||
      s.includes("بحة") || s.includes("رشح") || s.includes("زكام") || s.includes("انسداد")) {
      return {
        specialty: isAr ? "أنف وأذن وحنجرة" : "ENT (Otolaryngology)",
        severity: "low",
        nextStep: isAr ? "استشر طبيب أنف وأذن وحنجرة" : "Consult an ENT specialist",
        confidence: 80,
        suggestedTests: isAr ? ["منظار أنف", "اختبار سمع"] : ["Nasal Endoscopy", "Hearing Test"]
      };
    }

    // Urinary - المسالك البولية
    if (s.includes("urin") || s.includes("bladder") || s.includes("kidney") || s.includes("prostate") ||
      s.includes("بول") || s.includes("تبول") || s.includes("مثانة") || s.includes("كلى") ||
      s.includes("كلية") || s.includes("بروستاتا") || s.includes("حرقان في البول") ||
      s.includes("بول كتير") || s.includes("مش قادر ابول") || s.includes("وجع لما ببول") ||
      s.includes("دم في البول") || s.includes("مغص كلوي") || s.includes("حصوات")) {
      return {
        specialty: isAr ? "المسالك البولية" : "Urology",
        severity: "medium",
        nextStep: isAr ? "يرجى زيارة طبيب مسالك بولية" : "Please visit a urologist",
        confidence: 75,
        suggestedTests: isAr ? ["تحليل بول", "سونار كلى", "وظائف كلى"] : ["Urine Analysis", "Kidney Ultrasound", "Kidney Function Test"]
      };
    }

    // Women's health - النساء والتوليد
    if (s.includes("pregnancy") || s.includes("menstrual") || s.includes("ovary") || s.includes("uterus") ||
      s.includes("حمل") || s.includes("حامل") || s.includes("دورة") || s.includes("دورتي") ||
      s.includes("مبيض") || s.includes("رحم") || s.includes("الدورة الشهرية") ||
      s.includes("متأخرة") || s.includes("نزيف") || s.includes("افرازات") || s.includes("وجع الدورة")) {
      return {
        specialty: isAr ? "أمراض النساء والتوليد" : "Gynecology",
        severity: "medium",
        nextStep: isAr ? "استشيري طبيبة نساء وتوليد" : "Consult a gynecologist",
        confidence: 80,
        suggestedTests: isAr ? ["سونار نسائي", "تحليل هرمونات"] : ["Pelvic Ultrasound", "Hormone Test"]
      };
    }

    // Psychiatric/Mental Health - الطب النفسي
    if (s.includes("depress") || s.includes("anxiety") || s.includes("mental") || s.includes("stress") ||
      s.includes("اكتئاب") || s.includes("قلق") || s.includes("نفسي") || s.includes("توتر") ||
      s.includes("وسواس") || s.includes("مكتئب") || s.includes("قلقان") || s.includes("متوتر") ||
      s.includes("مش قادر انام") || s.includes("ارق") || s.includes("خايف") || s.includes("حزين") ||
      s.includes("زهقان") || s.includes("تعبان نفسيا") || s.includes("ضغط نفسي")) {
      return {
        specialty: isAr ? "الطب النفسي" : "Psychiatry",
        severity: "medium",
        nextStep: isAr ? "يرجى استشارة طبيب نفسي لتقييم الحالة" : "Please consult a psychiatrist for evaluation",
        confidence: 70,
        suggestedTests: isAr ? ["تقييم نفسي شامل"] : ["Comprehensive Psychological Evaluation"]
      };
    }

    // General Surgery/Appendicitis - الجراحة العامة
    if (s.includes("append") || s.includes("acute pain") || s.includes("surgery") ||
      s.includes("زايدة") || s.includes("زائدة") || s.includes("ألم حاد") || s.includes("جراحة") ||
      s.includes("وجع شديد") || s.includes("مغص شديد") || s.includes("ورم") || s.includes("كتلة")) {
      return {
        specialty: isAr ? "الجراحة العامة" : "General Surgery",
        severity: "high",
        nextStep: isAr ? "يجب التوجه للجراحة العامة أو الطوارئ فوراً" : "Should go to general surgery or ER immediately",
        confidence: 75,
        suggestedTests: isAr ? ["سونار", "أشعة مقطعية", "تحليل دم"] : ["Ultrasound", "CT Scan", "Blood Test"]
      };
    }

    // Endocrinology/Diabetes - الغدد الصماء والسكر
    if (s.includes("diabet") || s.includes("sugar") || s.includes("thyroid") || s.includes("hormone") ||
      s.includes("سكر") || s.includes("سكري") || s.includes("غدة") || s.includes("هرمون") ||
      s.includes("درقية") || s.includes("عندي سكر") || s.includes("سكر عالي") ||
      s.includes("عطشان") || s.includes("ببول كتير") || s.includes("تعبان") || s.includes("خمول")) {
      return {
        specialty: isAr ? "الغدد الصماء" : "Endocrinology",
        severity: "medium",
        nextStep: isAr ? "استشر طبيب غدد صماء وفحص مستوى السكر" : "Consult an endocrinologist and check blood sugar level",
        confidence: 80,
        suggestedTests: isAr ? ["تحليل سكر تراكمي", "وظائف غدة درقية"] : ["HbA1c", "Thyroid Function Test"]
      };
    }

    // Emergency Medicine - الطوارئ
    if (s.includes("emergen") || s.includes("accident") || s.includes("faint") || s.includes("bleed") ||
      s.includes("طوارئ") || s.includes("حادث") || s.includes("حادثة") || s.includes("إغماء") ||
      s.includes("نزيف") || s.includes("اغمى") || s.includes("فقدت الوعي") || s.includes("دم") ||
      s.includes("جرح") || s.includes("كسر") || s.includes("حرق") || s.includes("تسمم")) {
      return {
        specialty: isAr ? "طب الطوارئ" : "Emergency Medicine",
        severity: "high",
        nextStep: isAr ? "توجه لأقرب قسم طوارئ فوراً" : "Go to the nearest emergency department immediately",
        confidence: 90,
        suggestedTests: isAr ? ["فحوصات طوارئ شاملة"] : ["Comprehensive Emergency Tests"]
      };
    }

    // Default fallback
    return {
      specialty: isAr ? "الطب الباطني" : "Internal Medicine",
      severity: "medium",
      nextStep: isAr ? "يرجى استشارة طبيب باطني للتشخيص الأولي والفحص الشامل" : "Please consult an internal medicine physician for initial diagnosis and comprehensive examination",
      confidence: 50,
      suggestedTests: isAr ? ["صورة دم كاملة (CBC)", "تحليل بول", "سكر صائم"] : ["CBC", "Urine Analysis", "Fasting Blood Sugar"]
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      toast.error(lang === "ar" ? "من فضلك صف أعراضك" : "Please describe your symptoms");
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      // Call Supabase Edge Function instead of direct Gemini API
      const { data, error } = await supabase.functions.invoke('classify-symptoms', {
        body: {
          symptoms,
          age,
          gender,
          duration,
          painLevel: painLevel[0],
          chronicDiseases,
          emergencyFlags,
          language: lang
        }
      });

      if (error) {
        console.error("Edge Function error:", error);
        throw new Error(error.message || "Edge Function failed");
      }

      if (!data) {
        throw new Error("No response from Edge Function");
      }

      // Validate the response structure
      if (!data.specialty || !data.severity || !data.nextStep || typeof data.confidence !== 'number') {
        throw new Error("Invalid response structure from Edge Function");
      }

      setResult(data);
      toast.success(lang === "ar" ? "✅ تم التخصيص بنجاح   " : "✅ Analysis completed via Gemini AI");
    } catch (err: any) {
      console.error("Analysis error, using fallback:", err);
      setResult(getLocalAnalysis(symptoms, lang));
      toast.success(lang === "ar" ? "✅ تم التحليل المبدئي" : "✅ Preliminary analysis completed");
    } finally {
      setLoading(false);
    }
  };

  const severityConfig = {
    high: { color: "bg-destructive text-destructive-foreground", label: t("highRisk") },
    medium: { color: "bg-warning text-warning-foreground", label: t("mediumRisk") },
    low: { color: "bg-accent text-accent-foreground", label: t("lowRisk") },
  };

  return (
    <div className="container px-4 py-6 space-y-6 max-w-lg mx-auto">
      <div className="text-center space-y-1">
        <Stethoscope className="w-10 h-10 mx-auto text-primary" />
        <h1 className="text-2xl font-bold">{t("aiTitle")}</h1>
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-warning/10 border border-warning/30 px-3 py-2 text-sm">
        <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <p>{t("disclaimer")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>{t("symptoms")} *</Label>
          <Textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} rows={3} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>{t("age")}</Label>
            <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} min={0} max={120} />
          </div>
          <div className="space-y-2">
            <Label>{t("gender")}</Label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="male">{t("male")}</option>
              <option value="female">{t("female")}</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("duration")}</Label>
          <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 2 days" />
        </div>

        <div className="space-y-2">
          <Label>{t("painLevel")}: {painLevel[0]}/10</Label>
          <Slider value={painLevel} onValueChange={setPainLevel} min={1} max={10} step={1} />
        </div>

        <div className="space-y-2">
          <Label>{t("chronicDiseases")}</Label>
          <Input value={chronicDiseases} onChange={(e) => setChronicDiseases(e.target.value)} />
        </div>

        <div className="space-y-3">
          <Label className="text-destructive font-semibold">{t("emergencySymptoms")}</Label>
          {(["chestPain", "breathingDifficulty", "severeBleeding", "lossOfConsciousness"] as const).map((flag) => (
            <div key={flag} className="flex items-center gap-2">
              <Checkbox
                checked={emergencyFlags[flag]}
                onCheckedChange={(checked) =>
                  setEmergencyFlags((prev) => ({ ...prev, [flag]: !!checked }))
                }
              />
              <Label className="font-normal">{t(flag)}</Label>
            </div>
          ))}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? t("analyzing") : t("analyze")}
        </Button>
      </form>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">{t("specialty")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{result.specialty}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("severity")}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${severityConfig[result.severity].color}`}>
                  {severityConfig[result.severity].label}
                </span>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">{t("nextStep")}</p>
                <p className="text-sm text-muted-foreground">{result.nextStep}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("confidence")}</span>
                <span className="text-sm font-semibold">{result.confidence}%</span>
              </div>

              {/* Suggested Tests */}
              {result.suggestedTests && result.suggestedTests.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-1"><FlaskConical className="w-4 h-4" /> {t("suggestedTests")}</p>
                  <div className="flex flex-wrap gap-1">
                    {result.suggestedTests.map((test) => (
                      <Badge key={test} variant="secondary">{test}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Smart Redirection Button */}
          <div className="pt-2">
            {result.severity === "high" ? (
              <Link to={`/hospitals?status=available`}>
                <Button className="w-full h-12 text-lg shadow-lg hover:shadow-xl transition-all" size="lg">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  {lang === "ar" ? "ابحث عن أقرب مستشفى طوارئ" : "Find Nearest Emergency Hospital"}
                </Button>
              </Link>
            ) : (
              <Link to={`/doctors?specialty=${encodeURIComponent(result.specialty)}`}>
                <Button className="w-full h-12 text-lg shadow-lg hover:shadow-xl transition-all" size="lg">
                  <Stethoscope className="mr-2 h-5 w-5" />
                  {t("findSpecialist")}
                </Button>
              </Link>
            )}

            {result.suggestedTests && result.suggestedTests.length > 0 && (
              <Link to={`/labs?test=${encodeURIComponent(result.suggestedTests[0])}`} className="mt-3 block">
                <Button variant="outline" className="w-full" size="sm">
                  <FlaskConical className="mr-2 h-4 w-4" />
                  {lang === "ar" ? "البحث عن معمل لهذه التحاليل" : "Find Lab for these tests"}
                </Button>
              </Link>
            )}
          </div>

          {/* Matching Doctors */}
          {matchingDoctors.length > 0 && (
            <Card className="bg-muted/30">
              <CardHeader className="pb-2"><CardTitle className="text-base">{t("matchingDoctors")}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {matchingDoctors.map((d) => (
                  <div key={d.id} className="flex items-start justify-between border-b border-muted last:border-0 pb-2 last:pb-0">
                    <div>
                      <p className="font-medium text-sm">{lang === "ar" ? d.name_ar : d.name}</p>
                      <p className="text-xs text-muted-foreground">{lang === "ar" ? d.clinic_ar : d.clinic}</p>
                      <p className="text-xs text-muted-foreground">{d.distance.toFixed(1)} {t("kmAway")}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={`text-xs ${availabilityColors[d.availability]}`}>{t(d.availability as any)}</Badge>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3 h-3 fill-warning text-warning" /> {d.rating}
                        <span className="mx-0.5">•</span>
                        <Eye className="w-3 h-3" /> {d.visits.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Matching Hospitals */}
          {matchingHospitals.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-1"><Building2 className="w-4 h-4" /> {t("matchingHospitals")}</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {matchingHospitals.map((h) => (
                  <div key={h.id} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
                    <div>
                      <p className="font-medium text-sm">{lang === "ar" ? h.name_ar : h.name}</p>
                      <p className="text-xs text-muted-foreground">{h.distance.toFixed(1)} {t("kmAway")}</p>
                    </div>
                    <div className="flex gap-1">
                      <a href={`tel:${h.phone}`}><Button size="sm" variant="outline"><Phone className="w-3 h-3" /></Button></a>
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline"><Navigation className="w-3 h-3" /></Button>
                      </a>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Matching Labs */}
          {matchingLabs.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-1"><FlaskConical className="w-4 h-4" /> {t("labs")}</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {matchingLabs.map((l) => (
                  <div key={l.id} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
                    <div>
                      <p className="font-medium text-sm">{lang === "ar" ? l.name_ar : l.name}</p>
                      <p className="text-xs text-muted-foreground">{l.distance.toFixed(1)} {t("kmAway")}</p>
                    </div>
                    <a href={`tel:${l.phone}`}><Button size="sm" variant="outline"><Phone className="w-3 h-3" /></Button></a>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AIRouter;