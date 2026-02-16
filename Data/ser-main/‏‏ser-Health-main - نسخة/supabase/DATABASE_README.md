# نظام قاعدة البيانات - Database System

## نظرة عامة | Overview

تم تصميم قاعدة البيانات لدعم نظام تسجيل دخول متعدد الأطراف يشمل:
- **الأطباء** (Doctors)
- **المستشفيات** (Hospitals)
- **المتطوعين** (Volunteers)
- **الصيدليات** (Pharmacies)
- **المعامل** (Labs)

**المستخدم العادي** لا يحتاج لتسجيل دخول - الموقع مفتوح للجميع.

## هيكل قاعدة البيانات | Database Structure

### الجداول الرئيسية | Main Tables

#### 1. `auth_users` - جدول المصادقة الرئيسي
يحتوي على بيانات تسجيل الدخول لجميع الأطراف:
- `id` - معرف فريد (UUID)
- `email` - البريد الإلكتروني (فريد)
- `password_hash` - كلمة المرور المشفرة
- `user_type` - نوع المستخدم (doctor, hospital, volunteer, pharmacy, lab)
- `status` - حالة الحساب (pending, active, suspended, rejected)
- `email_verified` - تأكيد البريد الإلكتروني
- `phone` - رقم الهاتف

#### 2. `doctors` - جدول الأطباء
- معلومات الطبيب الشخصية والمهنية
- التخصص ورقم الترخيص
- عنوان العيادة وأوقات العمل
- رسوم الاستشارة
- التقييمات والمراجعات

#### 3. `hospitals` - جدول المستشفيات
- اسم المستشفى ورقم التسجيل
- نوع المستشفى (عام، خاص، تعليمي)
- العنوان والموقع الجغرافي
- عدد الأسرة المتاحة
- الأقسام والمرافق
- شركات التأمين المقبولة

#### 4. `volunteers` - جدول المتطوعين
- المعلومات الشخصية
- المهارات واللغات
- أوقات التطوع المتاحة
- ساعات التطوع المنجزة
- جهة الاتصال في حالات الطوارئ

#### 5. `pharmacies` - جدول الصيدليات
- اسم الصيدلية ورقم الترخيص
- اسم الصيدلي المسؤول
- العنوان وأوقات العمل
- خدمات التوصيل والطلب أونلاين
- شركات التأمين المقبولة

#### 6. `labs` - جدول المعامل
- اسم المعمل ورقم الترخيص
- اسم مدير المعمل
- أنواع التحاليل المتاحة
- خدمة التحاليل المنزلية
- متوسط وقت التسليم
- طرق استلام النتائج

## الأمان | Security

### Row Level Security (RLS)
تم تفعيل RLS على جميع الجداول مع السياسات التالية:

1. **المستخدمون المسجلون**:
   - يمكنهم قراءة وتعديل بياناتهم الخاصة فقط
   - لا يمكنهم رؤية بيانات المستخدمين الآخرين الخاصة

2. **الزوار (غير المسجلين)**:
   - يمكنهم رؤية الملفات الشخصية **المفعلة والموثقة فقط**
   - لا يمكنهم رؤية الحسابات المعلقة أو المرفوضة

## تطبيق الـ Migrations | Applying Migrations

### الطريقة 1: عبر Supabase Dashboard
1. افتح [Supabase Dashboard](https://app.supabase.com)
2. اختر مشروعك: `vpsdajedntuzftvvjepe`
3. اذهب إلى **SQL Editor**
4. انسخ محتوى الملفات بالترتيب:
   - `20260215_create_authentication_system.sql`
   - `20260215_create_rls_policies.sql`
   - `20260215_insert_sample_data.sql` (اختياري - للبيانات التجريبية)
5. نفذ كل ملف على حدة

### الطريقة 2: عبر Supabase CLI
```bash
# تأكد من تثبيت Supabase CLI
npm install -g supabase

# ربط المشروع
supabase link --project-ref vpsdajedntuzftvvjepe

# تطبيق الـ migrations
supabase db push
```

## البيانات التجريبية | Sample Data

تم إضافة بيانات تجريبية لكل نوع من المستخدمين:
- 2 أطباء
- 2 مستشفيات
- 2 متطوعين
- 2 صيدليات
- 2 معامل

**كلمة المرور الافتراضية لجميع الحسابات التجريبية**: `password123`

### حسابات تجريبية | Test Accounts

#### الأطباء:
- `dr.ahmed@example.com` - د. أحمد محمد (طب القلب)
- `dr.fatima@example.com` - د. فاطمة علي (طب الأطفال)

#### المستشفيات:
- `info@cairo.hospital.com` - مستشفى القاهرة الدولي
- `contact@alex.hospital.com` - مستشفى الإسكندرية الجامعي

#### المتطوعين:
- `volunteer1@example.com` - محمد حسن
- `volunteer2@example.com` - سارة أحمد

#### الصيدليات:
- `info@elshifa.pharmacy.com` - صيدلية الشفاء
- `contact@seha.pharmacy.com` - صيدلية الصحة

#### المعامل:
- `info@alpha.lab.com` - معمل ألفا
- `contact@beta.lab.com` - معمل بيتا

## الاستخدام في التطبيق | Usage in Application

### مثال على التسجيل | Registration Example

```typescript
import { supabase } from '@/lib/supabase';
import type { DoctorRegistrationDTO } from '@/types/database.types';

async function registerDoctor(data: DoctorRegistrationDTO) {
  // 1. Create auth user
  const { data: authUser, error: authError } = await supabase
    .from('auth_users')
    .insert({
      email: data.email,
      password_hash: await hashPassword(data.password),
      user_type: 'doctor',
      phone: data.phone,
    })
    .select()
    .single();

  if (authError) throw authError;

  // 2. Create doctor profile
  const { data: doctor, error: doctorError } = await supabase
    .from('doctors')
    .insert({
      auth_user_id: authUser.id,
      full_name: data.full_name,
      specialization: data.specialization,
      license_number: data.license_number,
      // ... other fields
    })
    .select()
    .single();

  if (doctorError) throw doctorError;

  return { authUser, doctor };
}
```

### مثال على تسجيل الدخول | Login Example

```typescript
async function login(email: string, password: string) {
  const { data: user, error } = await supabase
    .from('auth_users')
    .select('*, doctors(*), hospitals(*), volunteers(*), pharmacies(*), labs(*)')
    .eq('email', email)
    .single();

  if (error) throw error;

  // Verify password
  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) throw new Error('Invalid credentials');

  // Update last login
  await supabase
    .from('auth_users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', user.id);

  return user;
}
```

### مثال على جلب البيانات | Fetching Data Example

```typescript
// Get all verified doctors
async function getVerifiedDoctors() {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('verified', true)
    .order('rating', { ascending: false });

  if (error) throw error;
  return data;
}

// Get hospitals in a specific city
async function getHospitalsByCity(city: string) {
  const { data, error } = await supabase
    .from('hospitals')
    .select('*')
    .eq('city', city)
    .eq('verified', true);

  if (error) throw error;
  return data;
}
```

## ملاحظات مهمة | Important Notes

1. **تشفير كلمات المرور**: استخدم bcrypt أو argon2 لتشفير كلمات المرور
2. **التحقق من البريد الإلكتروني**: قم بإضافة نظام للتحقق من البريد الإلكتروني
3. **التوثيق**: يمكن استخدام Supabase Auth أو JWT للتوثيق
4. **الصور**: استخدم Supabase Storage لتخزين صور الملفات الشخصية
5. **البحث**: أضف Full-Text Search للبحث في الأطباء والمستشفيات
6. **الإشعارات**: أضف جدول للإشعارات لإعلام المستخدمين بحالة حساباتهم

## الخطوات التالية | Next Steps

1. ✅ إنشاء قاعدة البيانات
2. ⏳ تطبيق الـ migrations على Supabase
3. ⏳ إنشاء صفحات التسجيل لكل نوع مستخدم
4. ⏳ إنشاء صفحة تسجيل الدخول
5. ⏳ إنشاء لوحة تحكم لكل نوع مستخدم
6. ⏳ إضافة نظام التقييمات والمراجعات
7. ⏳ إضافة نظام البحث والفلترة

## الدعم | Support

للمساعدة أو الاستفسارات، يرجى الرجوع إلى:
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
