import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vpsdajedntuzftvvjepe.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwc2RhamVkbnR1emZ0dnZqZXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NDg2MzgsImV4cCI6MjA4NjQyNDYzOH0.7ZI5jh46cGGkJ9exiuG9fNBLzKqDcNWEEqoN-YDFjhw';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSqlFile(filePath: string) {
    console.log(`\n📄 Executing: ${path.basename(filePath)}`);
    console.log('─'.repeat(50));

    const sql = fs.readFileSync(filePath, 'utf-8');

    try {
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

        if (error) {
            console.error('❌ Error:', error.message);
            return false;
        }

        console.log('✅ Success!');
        return true;
    } catch (err: any) {
        console.error('❌ Error:', err.message);
        return false;
    }
}

async function main() {
    console.log('🚀 Starting database migration...\n');
    console.log('Project: vpsdajedntuzftvvjepe');
    console.log('URL:', supabaseUrl);
    console.log('═'.repeat(50));

    const migrationsDir = path.join(__dirname, '../supabase/migrations');

    const migrations = [
        '20260215_create_authentication_system.sql',
        '20260215_create_rls_policies.sql',
        '20260215_insert_sample_data.sql',
    ];

    let successCount = 0;

    for (const migration of migrations) {
        const filePath = path.join(migrationsDir, migration);

        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  File not found: ${migration}`);
            continue;
        }

        const success = await executeSqlFile(filePath);
        if (success) successCount++;
    }

    console.log('\n' + '═'.repeat(50));
    console.log(`\n✨ Migration complete! ${successCount}/${migrations.length} files executed successfully.\n`);

    if (successCount === migrations.length) {
        console.log('🎉 All migrations applied successfully!');
        console.log('\n📝 Test accounts (password: password123):');
        console.log('   - dr.ahmed@example.com (Doctor)');
        console.log('   - info@cairo.hospital.com (Hospital)');
        console.log('   - volunteer1@example.com (Volunteer)');
        console.log('   - info@elshifa.pharmacy.com (Pharmacy)');
        console.log('   - info@alpha.lab.com (Lab)');
    }
}

main().catch(console.error);
