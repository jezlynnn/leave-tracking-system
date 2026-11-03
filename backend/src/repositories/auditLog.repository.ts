import { PoolClient } from 'pg';
import { pool } from '../config/database';

export interface AuditLogEntry {
  userId: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
}

export class AuditLogRepository {
  async create(entry: AuditLogEntry, client?: PoolClient): Promise<void> {
    const db = client ?? pool;
    await db.query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        entry.userId,
        entry.action,
        entry.entityType ?? null,
        entry.entityId ?? null,
        entry.oldValues ? JSON.stringify(entry.oldValues) : null,
        entry.newValues ? JSON.stringify(entry.newValues) : null,
        entry.ipAddress ?? null,
      ]
    );
  }
}
