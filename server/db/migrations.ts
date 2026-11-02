import { DatabaseSync } from 'node:sqlite';

export interface Migration {
  id: number;
  name: string;
  up: (db: DatabaseSync) => void;
}

export const migrations: Migration[] = [
  {
    id: 1,
    name: '001_create_initial_account_schema',
    up: (db: DatabaseSync) => {
      // 1. User Account Table
      db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          user_id TEXT PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          google_account TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
      `);

      // 2. Normalized User Profile Table
      db.exec(`
        CREATE TABLE IF NOT EXISTS user_profiles (
          profile_id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL UNIQUE,
          account_type TEXT NOT NULL DEFAULT 'Freelancer' CHECK(account_type IN ('Freelancer', 'Client')),
          skill TEXT,
          bio TEXT,
          campus TEXT DEFAULT 'La Verdad Christian College',
          avatar_url TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        );
      `);

      // 3. User Session Table
      db.exec(`
        CREATE TABLE IF NOT EXISTS user_sessions (
          session_id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          created_at TEXT NOT NULL,
          expires_at TEXT NOT NULL,
          ip_address TEXT,
          user_agent TEXT,
          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        );
      `);

      // 4. Security Audit Log Table
      db.exec(`
        CREATE TABLE IF NOT EXISTS login_audit_logs (
          log_id TEXT PRIMARY KEY,
          user_id TEXT,
          google_account TEXT NOT NULL,
          action TEXT NOT NULL,
          status TEXT NOT NULL,
          ip_address TEXT,
          user_agent TEXT,
          created_at TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
        );
      `);

      // 5. Query Optimization & Integrity Indexes
      // Unique index on google_account for duplicate checking and rapid authentication lookups
      db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_account ON users(google_account);`);
      
      // Index on created_at for sorting and pagination
      db.exec(`CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);`);
      
      // Index on session user_id for rapid session retrieval and per-user session invalidation
      db.exec(`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);`);
      
      // Index on expires_at for efficient garbage collection of expired sessions
      db.exec(`CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON user_sessions(expires_at);`);
      
      // Unique index on user_profiles user_id for 1:1 referential integrity and joins
      db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_user_id ON user_profiles(user_id);`);
      
      // Index on login audit logs for rate limiting and brute force analysis
      db.exec(`CREATE INDEX IF NOT EXISTS idx_audit_google ON login_audit_logs(google_account, created_at);`);
    },
  },
  {
    id: 2,
    name: '002_add_resume_and_hiring_status',
    up: (db: DatabaseSync) => {
      // Introspect user_profiles columns to ensure idempotent execution
      const tableInfo = db.prepare("PRAGMA table_info(user_profiles)").all() as { name: string }[];
      const colNames = new Set(tableInfo.map((col) => col.name));

      if (!colNames.has('hiring_status')) {
        db.exec("ALTER TABLE user_profiles ADD COLUMN hiring_status TEXT DEFAULT 'for_hire';");
      }
      if (!colNames.has('resume_name')) {
        db.exec("ALTER TABLE user_profiles ADD COLUMN resume_name TEXT;");
      }
      if (!colNames.has('resume_size')) {
        db.exec("ALTER TABLE user_profiles ADD COLUMN resume_size TEXT;");
      }
      if (!colNames.has('resume_data')) {
        db.exec("ALTER TABLE user_profiles ADD COLUMN resume_data TEXT;");
      }
      if (!colNames.has('resume_updated_at')) {
        db.exec("ALTER TABLE user_profiles ADD COLUMN resume_updated_at TEXT;");
      }
    },
  },
  {
    id: 3,
    name: '003_update_joshua_to_mislang',
    up: (db: DatabaseSync) => {
      // Update any demo users with last name Rivera to Mislang
      db.exec("UPDATE users SET last_name = 'Mislang' WHERE first_name = 'Joshua' AND last_name = 'Rivera';");
      db.exec("UPDATE users SET last_name = 'Mislang' WHERE user_id = 'usr_joshua_lv1002';");
    },
  },
  {
    id: 4,
    name: '004_add_demo_password_column',
    up: (db: DatabaseSync) => {
      const tableInfo = db.prepare("PRAGMA table_info(users)").all() as { name: string }[];
      const colNames = new Set(tableInfo.map((col) => col.name));
      if (!colNames.has('demo_password')) {
        db.exec("ALTER TABLE users ADD COLUMN demo_password TEXT;");
      }
      db.prepare(`UPDATE users SET demo_password = ? WHERE google_account = ?`).run(
        'JhazzleySecure2026!',
        'jhazzley.pore@student.laverdad.edu.ph'
      );
      db.prepare(`UPDATE users SET demo_password = ? WHERE google_account = ?`).run(
        'studentpass123',
        'joshua.student@lvskillsync.edu'
      );
      // For any existing account without demo_password, ensure it has a valid test password
      db.prepare(`UPDATE users SET demo_password = 'studentpass123' WHERE demo_password IS NULL`).run();
    },
  },
];

export function runMigrations(db: DatabaseSync): void {
  // Ensure migration tracking table exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL
    );
  `);

  const appliedQuery = db.prepare(`SELECT name FROM _migrations`);
  const appliedRows = appliedQuery.all() as { name: string }[];
  const appliedSet = new Set(appliedRows.map((r) => r.name));

  const insertMigration = db.prepare(`
    INSERT INTO _migrations (name, applied_at) VALUES (?, ?)
  `);

  for (const migration of migrations) {
    if (!appliedSet.has(migration.name)) {
      console.log(`[SQL Migration] Applying migration: ${migration.name}`);
      migration.up(db);
      insertMigration.run(migration.name, new Date().toISOString());
      console.log(`[SQL Migration] Successfully applied: ${migration.name}`);
    }
  }
}
