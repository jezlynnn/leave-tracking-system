import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { env } from './config/env';

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
});

async function migrate(): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version     VARCHAR(255) PRIMARY KEY,
        applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    const { rows } = await client.query(
      `SELECT version FROM schema_migrations ORDER BY version`
    );
    const applied = new Set(rows.map((r: { version: string }) => r.version));

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`  [skip] ${file}`);
        continue;
      }

      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      console.log(`  [run]  ${file}`);

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(`INSERT INTO schema_migrations (version) VALUES ($1)`, [file]);
        await client.query('COMMIT');
        console.log(`  [ok]   ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    }

    console.log('\nMigrations complete.');
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err: Error) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
