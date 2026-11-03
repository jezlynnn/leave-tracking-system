import 'dotenv/config';
import { Pool } from 'pg';

// globalSetup — runs once before all test suites, outside test framework context
export default async function setup(): Promise<void> {
  const pool = new Pool({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await pool.query('SELECT 1');
    console.log('\n  [setup] Database connection verified\n');
  } finally {
    await pool.end();
  }
}
