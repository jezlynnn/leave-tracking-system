import { PoolClient } from 'pg';
import { pool } from '../config/database';
import { Department } from '../types';

function mapRow(row: Record<string, unknown>): Department {
  return {
    id: row.id as string,
    name: row.name as string,
    code: row.code as string,
    description: row.description as string | null,
    isActive: row.is_active as boolean,
    createdAt: row.created_at as Date,
    updatedAt: row.updated_at as Date,
  };
}

export class DepartmentRepository {
  async findAll(client?: PoolClient): Promise<Department[]> {
    const db = client ?? pool;
    const result = await db.query(
      `SELECT id, name, code, description, is_active, created_at, updated_at
       FROM departments WHERE is_active = true ORDER BY name`
    );
    return result.rows.map(mapRow);
  }

  async findById(id: string, client?: PoolClient): Promise<Department | null> {
    const db = client ?? pool;
    const result = await db.query(
      `SELECT id, name, code, description, is_active, created_at, updated_at
       FROM departments WHERE id = $1`,
      [id]
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  async create(
    data: { name: string; code: string; description?: string },
    client?: PoolClient
  ): Promise<Department> {
    const db = client ?? pool;
    const result = await db.query(
      `INSERT INTO departments (name, code, description)
       VALUES ($1, $2, $3)
       RETURNING id, name, code, description, is_active, created_at, updated_at`,
      [data.name, data.code.toUpperCase(), data.description ?? null]
    );
    return mapRow(result.rows[0]);
  }

  async existsByCode(code: string, client?: PoolClient): Promise<boolean> {
    const db = client ?? pool;
    const result = await db.query(`SELECT 1 FROM departments WHERE code = $1`, [code.toUpperCase()]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}
