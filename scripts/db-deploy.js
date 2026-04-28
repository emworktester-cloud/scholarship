import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Replace this URL or use process.env.DATABASE_URL
// Password URL-encoded to handle special characters like @ and #
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:%5BP%40ssw0rd%23emwork111%5D@db.najaomciziqoxmolygfs.supabase.co:5432/postgres';

async function deployDB() {
  console.log('🔄 Connecting to Supabase Database...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false } // Required for Supabase external connections
  });

  try {
    await client.connect();
    console.log('✅ Connected successfully!');

    const migrationFile = path.join(__dirname, '../supabase/migrations/20260427_init_v3.sql');
    
    if (!fs.existsSync(migrationFile)) {
      console.error('❌ Migration file not found at:', migrationFile);
      process.exit(1);
    }

    console.log(`📜 Reading SQL from ${migrationFile}...`);
    const sql = fs.readFileSync(migrationFile, 'utf8');

    console.log('⚡ Executing SQL... (This might take a few seconds)');
    await client.query(sql);

    console.log('🚀 Database schema deployed successfully!');
  } catch (err) {
    console.error('❌ Error executing deployment:', err);
  } finally {
    await client.end();
    console.log('🔌 Connection closed.');
  }
}

deployDB();
