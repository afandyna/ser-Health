#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Supabase configuration
const SUPABASE_URL = 'https://vpsdajedntuzftvvjepe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwc2RhamVkbnR1emZ0dnZqZXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NDg2MzgsImV4cCI6MjA4NjQyNDYzOH0.7ZI5jh46cGGkJ9exiuG9fNBLzKqDcNWEEqoN-YDFjhw';

console.log('╔════════════════════════════════════════════════╗');
console.log('║   Supabase Database Migration Tool            ║');
console.log('║   أداة تطبيق قاعدة البيانات                  ║');
console.log('╚════════════════════════════════════════════════╝\n');

console.log('⚠️  IMPORTANT NOTICE | ملاحظة مهمة');
console.log('─'.repeat(50));
console.log('This script requires manual execution of SQL files.');
console.log('هذا السكريبت يتطلب تنفيذ ملفات SQL يدوياً.\n');

console.log('📋 Please follow these steps | اتبع الخطوات التالية:\n');

console.log('1️⃣  Open Supabase SQL Editor:');
console.log('   افتح محرر SQL في Supabase:');
console.log('   🔗 https://app.supabase.com/project/vpsdajedntuzftvvjepe/sql/new\n');

console.log('2️⃣  Copy and execute these files in order:');
console.log('   انسخ ونفذ هذه الملفات بالترتيب:\n');

const migrationsDir = path.join(__dirname, '../supabase/migrations');
const migrations = [
    '20260215_create_authentication_system.sql',
    '20260215_create_rls_policies.sql',
    '20260215_insert_sample_data.sql',
];

migrations.forEach((file, index) => {
    const filePath = path.join(migrationsDir, file);
    console.log(`   ${String.fromCharCode(97 + index)}) ${file}`);

    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const lines = fs.readFileSync(filePath, 'utf-8').split('\n').length;
        console.log(`      📊 ${lines} lines, ${(stats.size / 1024).toFixed(1)} KB`);
    }
    console.log('');
});

console.log('3️⃣  After execution, test with these accounts:');
console.log('   بعد التنفيذ، اختبر بهذه الحسابات:\n');

console.log('   🔑 Password for all | كلمة المرور للجميع: password123\n');

const testAccounts = [
    { type: 'Doctor | طبيب', email: 'dr.ahmed@example.com', name: 'د. أحمد محمد' },
    { type: 'Hospital | مستشفى', email: 'info@cairo.hospital.com', name: 'مستشفى القاهرة' },
    { type: 'Volunteer | متطوع', email: 'volunteer1@example.com', name: 'محمد حسن' },
    { type: 'Pharmacy | صيدلية', email: 'info@elshifa.pharmacy.com', name: 'صيدلية الشفاء' },
    { type: 'Lab | معمل', email: 'info@alpha.lab.com', name: 'معمل ألفا' },
];

testAccounts.forEach(account => {
    console.log(`   • ${account.type}`);
    console.log(`     📧 ${account.email}`);
    console.log(`     👤 ${account.name}\n`);
});

console.log('═'.repeat(50));
console.log('\n💡 Tip | نصيحة:');
console.log('   Copy file contents with:');
console.log('   انسخ محتوى الملف بـ:\n');
console.log('   cat supabase/migrations/[filename].sql | pbcopy  # macOS');
console.log('   cat supabase/migrations/[filename].sql | xclip   # Linux\n');

console.log('📚 For more help | للمزيد من المساعدة:');
console.log('   Read: supabase/DATABASE_README.md');
console.log('   اقرأ: DATABASE_SETUP_SUMMARY.md\n');

console.log('═'.repeat(50));
console.log('✨ Ready to start! | جاهز للبدء!\n');
