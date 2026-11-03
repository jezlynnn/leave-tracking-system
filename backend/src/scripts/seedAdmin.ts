import 'dotenv/config';
import { pool } from '../config/database';
import { hashPassword } from '../utils/password';

async function seedAdmin(): Promise<void> {
  const email = 'admin@company.com';
  const password = 'Admin@1234';

  const hash = await hashPassword(password);

  await pool.query(
    `INSERT INTO users (email, password_hash, first_name, last_name, role)
     VALUES ($1, $2, 'System', 'Admin', 'admin')
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [email, hash]
  );

  console.log(`Admin user seeded: ${email} / ${password}`);
  await pool.end();
}

seedAdmin().catch((err: Error) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
