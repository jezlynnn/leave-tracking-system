import { PoolClient } from 'pg';
import { pool } from '../config/database';
import { User, PublicUser } from '../types';

function mapRow(row: Record<string, unknown>): PublicUser {
  return {
    id: row.id as string,
    email: row.email as string,
    firstName: row.first_name as string,
    lastName: row.last_name as string,
    role: row.role as PublicUser['role'],
    departmentId: row.department_id as string | null,
    managerId: row.manager_id as string | null,
    isActive: row.is_active as boolean,
    createdAt: row.created_at as Date,
    updatedAt: row.updated_at as Date,
  };
}

function mapRowWithHash(row: Record<string, unknown>): User {
  return {
    ...mapRow(row),
    passwordHash: row.password_hash as string,
  };
}

export class UserRepository {
  async findById(id: string, client?: PoolClient): Promise<PublicUser | null> {
    const db = client ?? pool;
    const result = await db.query(
      `SELECT id, email, first_name, last_name, role, department_id,
              manager_id, is_active, created_at, updated_at
       FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  async findByEmail(email: string, client?: PoolClient): Promise<User | null> {
    const db = client ?? pool;
    const result = await db.query(
      `SELECT id, email, password_hash, first_name, last_name, role,
              department_id, manager_id, is_active, created_at, updated_at
       FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );
    return result.rows[0] ? mapRowWithHash(result.rows[0]) : null;
  }

  async create(
    data: {
      email: string;
      passwordHash: string;
      firstName: string;
      lastName: string;
      role: string;
      departmentId?: string;
      managerId?: string;
    },
    client?: PoolClient
  ): Promise<PublicUser> {
    const db = client ?? pool;
    const result = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, department_id, manager_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, first_name, last_name, role, department_id, manager_id,
                 is_active, created_at, updated_at`,
      [
        data.email.toLowerCase(),
        data.passwordHash,
        data.firstName,
        data.lastName,
        data.role,
        data.departmentId ?? null,
        data.managerId ?? null,
      ]
    );
    return mapRow(result.rows[0]);
  }

  async updateLastLogin(id: string, client?: PoolClient): Promise<void> {
    const db = client ?? pool;
    await db.query(`UPDATE users SET updated_at = NOW() WHERE id = $1`, [id]);
  }

  async existsByEmail(email: string, client?: PoolClient): Promise<boolean> {
    const db = client ?? pool;
    const result = await db.query(`SELECT 1 FROM users WHERE email = $1`, [email.toLowerCase()]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}
