export interface Hospital {
  id: string;
  name: string;
  name_ar: string;
  phone: string;
  address: string;
  address_ar: string;
  lat: number;
  lng: number;
  ambulance: boolean;
  status: "available" | "busy" | "unavailable";
  distance?: number;
}

export interface Doctor {
  id: string;
  name: string;
  name_ar: string;
  specialty: string;
  specialty_ar: string;
  clinic: string;
  clinic_ar: string;
  phone: string;
  lat: number;
  lng: number;
  rating: number;
  visits: number;
  availability: "available" | "busy" | "offline";
  available_days: string[];
  available_slots: string[];
  distance?: number;
}

export interface Pharmacy {
  id: string;
  name: string;
  name_ar: string;
  address: string;
  address_ar: string;
  phone: string;
  lat: number;
  lng: number;
  is_open: boolean;
  distance?: number;
}

export interface Donation {
  id: string;
  donor_name: string;
  type: "ambulance" | "blood" | "supplies";
  location: string;
  location_ar: string;
  phone: string;
  lat: number;
  lng: number;
  distance?: number;

}

export interface Lab {
  id: string;
  name: string;
  name_ar: string;
  address: string;
  address_ar: string;
  phone: string;
  lat: number;
  lng: number;
  available_tests: string[];
  available_tests_ar: string[];
  distance?: number;
}

export interface Booking {
  id: string;
  doctor_id: string;
  patient_name: string;
  booking_date: string;
  booking_time: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}

export const hospitals: Hospital[] = [
  { id: "h1", name: "Mansoura University Hospitals", name_ar: "مستشفيات جامعة المنصورة", phone: "0502202876", address: "El Gomhouria Street, Mansoura", address_ar: "شارع الجمهورية، المنصورة", lat: 31.044283747970326, lng: 31.363831964025813, ambulance: true, status: "available" },
  { id: "h2", name: "Mansoura University Emergency Hospital", name_ar: "مستشفى طوارىء جامعة المنصورة", phone: "0502265472", address: "Jehan Sadat, Mansoura", address_ar: "جيهان السادات، المنصورة", lat: 31.04310027470715, lng: 31.364772308767215, ambulance: true, status: "available" },
  { id: "h3", name: "Mansoura Specialized Hospital", name_ar: "مستشفى المنصورة التخصصي", phone: "0502202879", address: "General Hospital, Mansoura, Beginning of Mansoura", address_ar: "المستشفى العام، المنصورة، اول المنصورة", lat: 31.044350111978606, lng: 31.366261882592145, ambulance: false, status: "busy" },
  { id: "h4", name: "Delta Hospital", name_ar: "مستشفى الدلتا", phone: "0502944602", address: "Jihan Sadat, Mansoura, Dakahlia Governorate", address_ar: "جيهان السادات، المنصورة، محافظة الدقهلية", lat: 31.04283625863789, lng: 31.36507468862837, ambulance: true, status: "available" },
  { id: "h5", name: "Aja Central Hospital (Amiri)", name_ar: "مستشفى اجا المركزي ( الاميري )", phone: "0504455311", address: "Port Said, Aja City, Aja Center, Dakahlia Governorate", address_ar: "بور سعيد، مدينة أجا، مركز أجا، محافظة الدقهلية ", lat: 30.935878957988155, lng: 31.290379499818172, ambulance: true, status: "busy" },
  { id: "h6", name: "Al Tawhid Private Hospital", name_ar: " مستشفي التوحيد الخاصة", phone: "0504455662", address: "Aja Center, Dakahlia Governorate", address_ar: "مركز أجا، محافظة الدقهلية", lat: 30.93952712385451, lng: 31.293347461648438, ambulance: true, status: "available" },
  { id: "h7", name: "Cleopatra Hospital", name_ar: "مستشفى كليوباترا", phone: "0224143931", address: "Salah Salem, Cairo", address_ar: "صلاح سالم، القاهرة", lat: 30.093211315572713, lng: 31.329815904011046, ambulance: true, status: "available" },
  { id: "h8", name: "Al-Salam International Hospital", name_ar: "مستشفى السلام الدولي", phone: "01092001443", address: "Maadi, Cairo", address_ar: "المعادي، القاهرة", lat: 29.985122824722197, lng: 29.985122824722197, ambulance: false, status: "available" },
  { id: "h9", name: "Tahrir General Hospital", name_ar: "مستشفى التحرير العام", phone: "0233118347", address: "Nasouh Pasha St., Tahrir City, Giza", address_ar: "ش نصوح باشا، مدينة التحرير، الجيزة", lat: 30.08124249702104, lng: 31.22240966751517, ambulance: true, status: "busy" },
  { id: "h10", name: "Al-Galaa Military Hospital", name_ar: "مستشفى الجلاء العسكري", phone: "+20-2-012-3456", address: "Heliopolis, Cairo", address_ar: "مصر الجديدة، القاهرة", lat: 30.09378802018141, lng: 31.346049501042014, ambulance: true, status: "available" },
];

export const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Ahmed Al-Farsi",
    name_ar: "د. أحمد الفارسي",
    specialty: "Cardiology",
    specialty_ar: "أمراض القلب",
    clinic: "Heart Care Clinic",
    clinic_ar: "المنصورة، الدقهلية",
    phone: "+20-10-111-1111",
    lat: 31.0405,
    lng: 31.3780,
    rating: 0,
    visits: 0,
    availability: "available",
    available_days: ["Sun", "Mon", "Tue", "Wed", "Thu"],
    available_slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  },
  {
    id: "d2",
    name: "Dr. Sara Hassan",
    name_ar: "د. سارة حسن",
    specialty: "Ophthalmology",
    specialty_ar: "طب العيون",
    clinic: "Vision Plus",
    clinic_ar: "المنصورة، الدقهلية",
    phone: "+20-10-222-2222",
    lat: 31.0410,
    lng: 31.3760,
    rating: 0,
    visits: 0,
    availability: "available",
    available_days: ["Sun", "Mon", "Wed", "Thu"],
    available_slots: ["10:00", "11:00", "12:00", "15:00", "16:00"],
  },
  {
    id: "d3",
    name: "Dr. Omar Khalid",
    name_ar: "د. عمر خالد",
    specialty: "Orthopedics",
    specialty_ar: "جراحة العظام",
    clinic: "Bone & Joint Center",
    clinic_ar: "المنصورة، الدقهلية",
    phone: "+20-10-333-3333",
    lat: 31.0420,
    lng: 31.3800,
    rating: 0,
    visits: 0,
    availability: "busy",
    available_days: ["Sun", "Tue", "Thu"],
    available_slots: ["09:00", "10:00", "14:00", "15:00"],
  },
  {
    id: "d4",
    name: "Dr. Fatima Al-Rashid",
    name_ar: "د. فاطمة الراشد",
    specialty: "Dermatology",
    specialty_ar: "الأمراض الجلدية",
    clinic: "Skin Care Clinic",
    clinic_ar: "المنصورة، الدقهلية",
    phone: "+20-10-444-4444",
    lat: 31.0435,
    lng: 31.3825,
    rating: 0,
    visits: 0,
    availability: "available",
    available_days: ["Mon", "Wed", "Thu"],
    available_slots: ["10:00", "11:00", "15:00", "16:00", "17:00"],
  },
  {
    id: "d5",
    name: "Dr. Youssef Nabil",
    name_ar: "د. يوسف نبيل",
    specialty: "Internal Medicine",
    specialty_ar: "الطب الباطني",
    clinic: "General Medicine Center",
    clinic_ar: "المنصورة، الدقهلية",
    phone: "+20-10-555-5555",
    lat: 31.0390,
    lng: 31.3790,
    rating: 0,
    visits: 0,
    availability: "available",
    available_days: ["Sun", "Mon", "Tue", "Wed", "Thu"],
    available_slots: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00"],
  },
];


export const pharmacies: Pharmacy[] = [
  // ===== المنصورة – الدقهلية (10 صيدليات حقيقية) =====
  { id: "m1", name: "صيدلية البسطويسى ", name_ar: "صيدلية البسطويسى ", address: "Mansoura, Dakahlia, Egypt", address_ar: "المنصورة، الدقهلية، مصر", phone: "0502333333", lat: 31.04627925297938, lng: 31.370879774245818, is_open: true },
  { id: "m2", name: "صيدلية الشيماء", name_ar: "صيدلية الشيماء", address: " المنصورة، الدقهلية", address_ar: " المنصورة، الدقهلية، مصر", phone: "0502344470", lat: 31.036547179586087, lng: 31.36519659968262, is_open: true },
  { id: "m3", name: "صيدلية مطاوع", name_ar: "صيدلية مطاوع", address: "المنصوره، الدقهلية، مصر", address_ar: "المنصورة، الدقهلية، مصر", phone: "01201206505", lat: 31.039794576287683, lng: 31.363412583544058, is_open: true },
  { id: "m4", name: "صيدلية د/مجاهد السيد", name_ar: "صيدلية د/مجاهد السيد", address: " طلخا، الدقهلية", address_ar: "تقسيم سامية الجمل، المنصورة، الدقهلية، مصر", phone: "+20-50-2222669", lat: 31.0460, lng: 31.3720, is_open: true },
  { id: "m5", name: "صيدلية البهني", name_ar: "صيدلية البهني", address: "شارع الجامع، المنصورة، الدقهلية", address_ar: "شارع الجامع، المنصورة، الدقهلية، مصر", phone: "+20-50-2331180", lat: 31.0442, lng: 31.3660, is_open: true },
  { id: "m6", name: "Serag El Din Pharmacy", name_ar: "صيدلية سراج الدين", address: "62 شارع الجمهورية، المنصورة", address_ar: "٦٢ شارع الجمهورية، المنصورة، الدقهلية، مصر", phone: "+20-50-2268865", lat: 31.0457, lng: 31.3571, is_open: true },
  { id: "m7", name: "صيدلية الرحمة", name_ar: "صيدلية الرحمة", address: "منشية الأوقاف، المنصورة، الدقهلية", address_ar: "منشية الأوقاف، المنصورة، الدقهلية، مصر", phone: "+20-50-xxxxxxxx", lat: 31.0435, lng: 31.3750, is_open: true },
  { id: "m8", name: "صيدليات كير", name_ar: "صيدليات كير", address: "46 ش حسين بك، المنصورة، الدقهلية", address_ar: "٤٦ شارع حسين بك، المنصورة، الدقهلية، مصر", phone: "+20-50-2122332", lat: 31.0433, lng: 31.3847, is_open: true },
  { id: "m9", name: "Al Doha Pharmacy", name_ar: "صيدلية الدوحة", address: "الإمام محمد عبده، المنصورة، الدقهلية", address_ar: "الإمام محمد عبده، المنصورة، الدقهلية، مصر", phone: "+20-102-6012221", lat: 31.0563, lng: 31.4035, is_open: true },
  { id: "m10", name: "Dr. Walid El Tarshouby Pharmacy", name_ar: "صيدلية د. وليد الطرشوبي", address: "سنبلّاواين – الدقهلية", address_ar: "سنبلّاواين – الدقهلية، مصر", phone: "+20-50-xxxxxxxx", lat: 31.0250, lng: 31.3800, is_open: true },

  // ===== محافظة القاهرة (1 صيدلية) =====
  { id: "c1", name: "Stephenson Pharmacy", name_ar: "صيدلية ستيفنسون", address: "42 Abdel Khalek Tharwat St., Abdeen, Cairo", address_ar: "٤٢ شارع عبد الخالق ثروت، عبّدين، القاهرة، مصر", phone: "+20-2239-11482", lat: 30.05056, lng: 31.24453, is_open: false },

  // ===== محافظة البحيرة (1 صيدلية) =====
  { id: "b1", name: "19011", name_ar: "صيدلية 19011", address: "عبد السلام الشاذلي، أمام ديوان عام المحافظة، دمنهور، البحيرة", address_ar: "عبد السلام الشاذلي، أمام ديوان عام المحافظة، دمنهور، البحيرة، مصر", phone: "19011", lat: 31.04436, lng: 30.46676, is_open: true },
];

export const donations: Donation[] = [
  {
    id: "dn1",
    donor_name: "علي محمود (A+)",
    type: "blood",
    location: "المنصورة، الدقهلية",
    location_ar: "المنصورة، الدقهلية",
    phone: "+20-50-123-0001",
    lat: 31.0409,
    lng: 31.3785
  },
  {
    id: "dn2",
    donor_name: "سارة فتحي (O-)",
    type: "blood",
    location: "ميت غمر، الدقهلية",
    location_ar: "ميت غمر، الدقهلية",
    phone: "+20-50-123-0002",
    lat: 30.7350,
    lng: 31.1800
  },
  {
    id: "dn3",
    donor_name: "محمد صلاح",
    type: "ambulance",
    location: "دكرنس، الدقهلية",
    location_ar: "دكرنس، الدقهلية",
    phone: "+20-50-123-0003",
    lat: 31.0500,
    lng: 31.4300
  },
  {
    id: "dn4",
    donor_name: "هناء نبيل (AB-)",
    type: "blood",
    location: "بلقاس، الدقهلية",
    location_ar: "بلقاس، الدقهلية",
    phone: "+20-50-123-0004",
    lat: 31.2100,
    lng: 31.3800
  },
  {
    id: "dn5",
    donor_name: "عمر يوسف",
    type: "ambulance",
    location: "المنزلة، الدقهلية",
    location_ar: "المنزلة، الدقهلية",
    phone: "+20-50-123-0005",
    lat: 31.0900,
    lng: 31.3400
  },
  {
    id: "dn6",
    donor_name: "ليلى حسام (B-)",
    type: "blood",
    location: "طلخا، الدقهلية",
    location_ar: "طلخا، الدقهلية",
    phone: "+20-50-123-0006",
    lat: 31.0505,
    lng: 31.3600
  },
  {
    id: "dn7",
    donor_name: "أحمد فوزي (A-)",
    type: "blood",
    location: "المنصورة، الدقهلية",
    location_ar: "المنصورة، الدقهلية",
    phone: "+20-50-123-0007",
    lat: 31.0420,
    lng: 31.3770
  },
  {
    id: "dn8",
    donor_name: "نورهان سامي",
    type: "ambulance",
    location: "ميت غمر، الدقهلية",
    location_ar: "ميت غمر، الدقهلية",
    phone: "+20-50-123-0008",
    lat: 30.7360,
    lng: 31.1820
  },
  {
    id: "dn9",
    donor_name: "ياسين خالد (O-)",
    type: "blood",
    location: "بلقاس، الدقهلية",
    location_ar: "بلقاس، الدقهلية",
    phone: "+20-50-123-0009",
    lat: 31.2110,
    lng: 31.3820
  },
  {
    id: "dn10",
    donor_name: "منى عادل",
    type: "ambulance",
    location: "دكرنس، الدقهلية",
    location_ar: "دكرنس، الدقهلية",
    phone: "+20-50-123-0010",
    lat: 31.0510,
    lng: 31.4310
  },
  {
    id: "dn11",
    donor_name: "تامر نجيب (A+)",
    type: "blood",
    location: "المنزلة، الدقهلية",
    location_ar: "المنزلة، الدقهلية",
    phone: "+20-50-123-0011",
    lat: 31.0910,
    lng: 31.3410
  },
  {
    id: "dn12",
    donor_name: "فاطمة شريف (AB-)",
    type: "blood",
    location: "طلخا، الدقهلية",
    location_ar: "طلخا، الدقهلية",
    phone: "+20-50-123-0012",
    lat: 31.0515,
    lng: 31.3610
  },
  {
    id: "dn13",
    donor_name: "خالد مصطفى",
    type: "ambulance",
    location: "المنصورة، الدقهلية",
    location_ar: "المنصورة، الدقهلية",
    phone: "+20-50-123-0013",
    lat: 31.0430,
    lng: 31.3790
  },
  {
    id: "dn14",
    donor_name: "دينا مجدي (B-)",
    type: "blood",
    location: "ميت غمر، الدقهلية",
    location_ar: "ميت غمر، الدقهلية",
    phone: "+20-50-123-0014",
    lat: 30.7370,
    lng: 31.1830
  },
  {
    id: "dn15",
    donor_name: "محمود فتحي",
    type: "ambulance",
    location: "بلقاس، الدقهلية",
    location_ar: "بلقاس، الدقهلية",
    phone: "+20-50-123-0015",
    lat: 31.2120,
    lng: 31.3830
  }
];

export const labs: Lab[] = [
  {
    id: "l1",
    name: "Al-Borg Laboratories",
    name_ar: "معامل البرج",
    address: "El Gomhoria St, Mansoura",
    address_ar: "شارع الجمهورية، المنصورة",
    phone: "+20-2-100-0001",
    lat: 31.0453,
    lng: 31.3618,
    available_tests: ["CBC", "Blood Sugar", "Liver Function", "Kidney Function", "Thyroid", "Urine Analysis", "X-Ray"],
    available_tests_ar: ["صورة دم كاملة", "سكر الدم", "وظائف الكبد", "وظائف الكلى", "الغدة الدرقية", "تحليل بول", "أشعة سينية"],
  },
  {
    id: "l2",
    name: "El-Mokhtabar Laboratories",
    name_ar: "معامل المختبر",
    address: "Gehan St, Mansoura",
    address_ar: "شارع جيهان، المنصورة",
    phone: "+20-2-100-0002",
    lat: 31.0396,
    lng: 31.3724,
    available_tests: ["CBC", "Blood Sugar", "MRI", "CT Scan", "Urine Analysis", "Lipid Profile"],
    available_tests_ar: ["صورة دم كاملة", "سكر الدم", "رنين مغناطيسي", "أشعة مقطعية", "تحليل بول", "دهون الدم"],
  },
  {
    id: "l3",
    name: "Cairo Scan Radiology",
    name_ar: "كايرو سكان للأشعة",
    address: "Toriel St, Mansoura",
    address_ar: "شارع توريل، المنصورة",
    phone: "+20-2-100-0003",
    lat: 31.0421,
    lng: 31.3897,
    available_tests: ["X-Ray", "MRI", "CT Scan", "Ultrasound", "Mammogram", "Bone Density"],
    available_tests_ar: ["أشعة سينية", "رنين مغناطيسي", "أشعة مقطعية", "سونار", "ماموجرام", "كثافة العظام"],
  },
  {
    id: "l4",
    name: "Alfa Lab",
    name_ar: "معامل ألفا",
    address: "El Mashaya St, Mansoura",
    address_ar: "شارع المشاية، المنصورة",
    phone: "+20-2-100-0004",
    lat: 31.0488,
    lng: 31.3779,
    available_tests: ["CBC", "Blood Sugar", "Liver Function", "Kidney Function", "Vitamin D", "Iron", "Urine Analysis"],
    available_tests_ar: ["صورة دم كاملة", "سكر الدم", "وظائف الكبد", "وظائف الكلى", "فيتامين د", "حديد", "تحليل بول"],
  },
  {
    id: "l5",
    name: "Nile Radiology Center",
    name_ar: "مركز النيل للأشعة",
    address: "University Area, Mansoura",
    address_ar: "منطقة الجامعة، المنصورة",
    phone: "+20-2-100-0005",
    lat: 31.0339,
    lng: 31.4026,
    available_tests: ["X-Ray", "MRI", "CT Scan", "Ultrasound", "ECG", "Echo"],
    available_tests_ar: ["أشعة سينية", "رنين مغناطيسي", "أشعة مقطعية", "سونار", "رسم قلب", "إيكو"],
  },
  {
    id: "l6",
    name: "Delta Medical Labs",
    name_ar: "معامل دلتا الطبية",
    address: "Sidi Yassin St, Mansoura",
    address_ar: "شارع سيدي ياسين، المنصورة",
    phone: "+20-2-100-0006",
    lat: 31.0502,
    lng: 31.3693,
    available_tests: ["CBC", "Blood Sugar", "CRP", "ESR", "Urine Analysis"],
    available_tests_ar: ["صورة دم كاملة", "سكر الدم", "تحليل CRP", "سرعة الترسيب", "تحليل بول"],
  },
  {
    id: "l7",
    name: "Future Labs",
    name_ar: "معامل المستقبل",
    address: "Gamaa St, Mansoura",
    address_ar: "شارع الجامعة، المنصورة",
    phone: "+20-2-100-0007",
    lat: 31.0318,
    lng: 31.3951,
    available_tests: ["CBC", "Blood Sugar", "Vitamin B12", "Vitamin D", "Iron"],
    available_tests_ar: ["صورة دم كاملة", "سكر الدم", "فيتامين ب12", "فيتامين د", "حديد"],
  },
  {
    id: "l8",
    name: "Care Plus Labs",
    name_ar: "معامل كير بلس",
    address: "El Tawfiqeya St, Mansoura",
    address_ar: "شارع التوفيقية، المنصورة",
    phone: "+20-2-100-0008",
    lat: 31.0441,
    lng: 31.3567,
    available_tests: ["CBC", "Blood Sugar", "Liver Function", "Kidney Function", "Urine Analysis"],
    available_tests_ar: ["صورة دم كاملة", "سكر الدم", "وظائف الكبد", "وظائف الكلى", "تحليل بول"],
  },
  {
    id: "l9",
    name: "Life Scan Center",
    name_ar: "مركز لايف سكان",
    address: "El Salam St, Mansoura",
    address_ar: "شارع السلام، المنصورة",
    phone: "+20-2-100-0009",
    lat: 31.0571,
    lng: 31.3814,
    available_tests: ["X-Ray", "Ultrasound", "ECG", "Echo"],
    available_tests_ar: ["أشعة سينية", "سونار", "رسم قلب", "إيكو"],
  },
  {
    id: "l10",
    name: "Prime Medical Labs",
    name_ar: "برايم ميديكال لاب",
    address: "El Galaa St, Mansoura",
    address_ar: "شارع الجلاء، المنصورة",
    phone: "+20-2-100-0010",
    lat: 31.0364,
    lng: 31.4092,
    available_tests: ["CBC", "Blood Sugar", "Hormones", "Thyroid", "Urine Analysis"],
    available_tests_ar: ["صورة دم كاملة", "سكر الدم", "تحاليل هرمونات", "الغدة الدرقية", "تحليل بول"],
  },
];

export const emergencyNumbers = [
  { name: "Ambulance", name_ar: "الإسعاف", number: "123" },
  { name: "Police", name_ar: "الشرطة", number: "122" },
  { name: "Fire", name_ar: "الإطفاء", number: "180" },
  { name: "Traffic Accidents", name_ar: "حوادث المرور", number: "128" },
];

// In-memory bookings store
export const bookings: Booking[] = [];

export function addBooking(booking: Omit<Booking, "id" | "created_at">): Booking {
  const newBooking: Booking = {
    ...booking,
    id: `b${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  bookings.push(newBooking);
  return newBooking;
}

export function cancelBooking(id: string): boolean {
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx >= 0) {
    bookings[idx].status = "cancelled";
    return true;
  }
  return false;
}

export function isSlotBooked(doctorId: string, date: string, time: string): boolean {
  return bookings.some(
    (b) => b.doctor_id === doctorId && b.booking_date === date && b.booking_time === time && b.status !== "cancelled"
  );
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 1 + R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
