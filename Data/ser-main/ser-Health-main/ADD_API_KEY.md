# ✅ إضافة Gemini API Key - خطوات سريعة

## الـ API Key الخاص بك:
```
AIzaSyBHqagG36BLK-UvusnimZOWlv03-gEVwfQ
```

## الطريقة الأولى: عبر Supabase Dashboard (الأسهل) ⭐

### الخطوات:

1. **افتح Supabase Dashboard**
   - اذهب إلى: https://supabase.com/dashboard/project/pfmmyzbboewiqxfxsuhk

2. **اذهب لإعدادات Edge Functions**
   - من القائمة الجانبية: **Edge Functions**
   - أو اذهب مباشرة: https://supabase.com/dashboard/project/pfmmyzbboewiqxfxsuhk/functions

3. **أضف Secret جديد**
   - اضغط على **"Manage secrets"** أو **"Add secret"**
   - **Name**: `GEMINI_API_KEY`
   - **Value**: `AIzaSyBHqagG36BLK-UvusnimZOWlv03-gEVwfQ`
   - اضغط **Save**

4. **انشر الـ Edge Function**
   - في نفس الصفحة، اذهب لـ **classify-symptoms**
   - اضغط **Deploy** أو **Redeploy**
   - (أو ارفع الملف `/home/bassem/giii/supabase/functions/classify-symptoms/index.ts`)

---

## الطريقة الثانية: عبر Supabase CLI

### 1. تثبيت Supabase CLI (إذا لم يكن مثبت):
```bash
npm install -g supabase
```

### 2. تسجيل الدخول:
```bash
supabase login
```

### 3. ربط المشروع:
```bash
cd /home/bassem/giii
supabase link --project-ref pfmmyzbboewiqxfxsuhk
```

### 4. إضافة الـ Secret:
```bash
supabase secrets set GEMINI_API_KEY=AIzaSyBHqagG36BLK-UvusnimZOWlv03-gEVwfQ
```

### 5. نشر الـ Edge Function:
```bash
supabase functions deploy classify-symptoms
```

---

## ✅ بعد الإضافة:

1. **جرب الموقع** على: http://localhost:8080/
2. **اذهب لصفحة AI Router**
3. **اكتب أي أعراض بالعربي** (مثل: "عندي ألم في معدتي")
4. **لو شتغل**: هتشوف تحليل دقيق من Gemini AI
5. **لو مشتغلش**: النظام هيستخدم Local Fallback تلقائياً

---

## 🔍 التحقق من نجاح الإضافة:

بعد ما تضيف الـ Secret وتنشر الـ Function، جرب تكتب أعراض وشوف الرسالة:
- ✅ **لو ظهرت نتيجة مباشرة**: Gemini API شغال
- ⚠️ **لو ظهرت "تم استخدام تحليل مبدئي"**: Local Fallback شغال (الـ API مش متصل)

---

## 📞 المساعدة:

إذا واجهت أي مشكلة:
1. تأكد إن الـ Secret Name بالضبط: `GEMINI_API_KEY`
2. تأكد إن الـ API Key صحيح
3. تأكد إن الـ Edge Function اتنشرت بنجاح
