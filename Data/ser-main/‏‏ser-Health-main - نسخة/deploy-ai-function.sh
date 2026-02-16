#!/bin/bash

# 🚀 سكريبت نشر Edge Function للـ AI Symptom Analyzer

echo "🔍 التحقق من Supabase CLI..."

# التحقق من تثبيت Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI غير مثبت!"
    echo ""
    echo "📦 لتثبيت Supabase CLI، نفذ الأمر التالي:"
    echo ""
    echo "npm install -g supabase"
    echo ""
    echo "أو:"
    echo ""
    echo "brew install supabase/tap/supabase  # على macOS"
    echo ""
    exit 1
fi

echo "✅ Supabase CLI موجود"
echo ""

# التحقق من تسجيل الدخول
echo "🔐 التحقق من تسجيل الدخول..."
if ! supabase projects list &> /dev/null; then
    echo "❌ غير مسجل دخول!"
    echo ""
    echo "🔑 لتسجيل الدخول، نفذ:"
    echo ""
    echo "supabase login"
    echo ""
    exit 1
fi

echo "✅ مسجل دخول"
echo ""

# ربط المشروع
echo "🔗 ربط المشروع..."
PROJECT_ID="pfmmyzbboewiqxfxsuhk"

# التحقق من الربط
if [ ! -f ".supabase/config.toml" ]; then
    echo "🔗 ربط المشروع بـ Supabase..."
    supabase link --project-ref $PROJECT_ID
    if [ $? -ne 0 ]; then
        echo "❌ فشل ربط المشروع!"
        exit 1
    fi
fi

echo "✅ المشروع مربوط"
echo ""

# نشر Edge Function
echo "🚀 نشر classify-symptoms Edge Function..."
supabase functions deploy classify-symptoms

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ✅ ✅ تم النشر بنجاح! ✅ ✅ ✅"
    echo ""
    echo "📝 الخطوات التالية:"
    echo ""
    echo "1️⃣  احصل على Gemini API Key من:"
    echo "    https://aistudio.google.com/app/apikey"
    echo ""
    echo "2️⃣  أضف المفتاح إلى Supabase:"
    echo "    supabase secrets set GEMINI_API_KEY=your-api-key-here"
    echo ""
    echo "    أو عبر Dashboard:"
    echo "    https://supabase.com/dashboard/project/$PROJECT_ID/settings/functions"
    echo ""
    echo "3️⃣  جرب الموقع:"
    echo "    http://localhost:8080/ai-router"
    echo ""
else
    echo ""
    echo "❌ فشل النشر!"
    echo ""
    echo "🔍 تحقق من:"
    echo "  - هل أنت متصل بالإنترنت؟"
    echo "  - هل لديك صلاحيات على المشروع؟"
    echo "  - هل Supabase CLI محدث؟"
    echo ""
    exit 1
fi
