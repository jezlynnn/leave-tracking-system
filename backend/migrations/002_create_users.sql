CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  role          VARCHAR(20) NOT NULL DEFAULT 'employee',
  department_id UUID REFERENCES departments (id) ON DELETE SET NULL,
  manager_id    UUID REFERENCES users (id) ON DELETE SET NULL,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_email_unique UNIQUE (email),
  CONSTRAINT users_role_check CHECK (role IN ('admin', 'manager', 'employee'))
);

CREATE INDEX IF NOT EXISTS idx_users_email     ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role      ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_dept      ON users (department_id);
CREATE INDEX IF NOT EXISTS idx_users_manager   ON users (manager_id);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users (is_active);

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
