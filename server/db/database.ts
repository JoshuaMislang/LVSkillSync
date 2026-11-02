import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { runMigrations } from './migrations';
import { hashPassword } from '../security/passwords';

let dbInstance: DatabaseSync | null = null;

export function getDatabasePath(): string {
  if (process.env.DATABASE_PATH) {
    const customPath = process.env.DATABASE_PATH;
    const resolved = path.isAbsolute(customPath)
      ? customPath
      : path.resolve(process.cwd(), customPath);
    const parentDir = path.dirname(resolved);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    return resolved;
  }
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, 'lvskillsync.sqlite');
}

export function getDb(): DatabaseSync {
  if (!dbInstance) {
    const dbPath = getDatabasePath();
    console.log(`[SQL Database] Initializing SQLite connection at: ${dbPath}`);
    dbInstance = new DatabaseSync(dbPath);

    // Enforce foreign key constraints
    dbInstance.exec('PRAGMA foreign_keys = ON;');
    
    // Enable Write-Ahead Logging (WAL) for high concurrency read/write
    dbInstance.exec('PRAGMA journal_mode = WAL;');
    
    // Performance optimization for WAL mode
    dbInstance.exec('PRAGMA synchronous = NORMAL;');

    // Run schema migrations
    runMigrations(dbInstance);

    // Seed default baseline accounts if empty
    seedInitialAccounts(dbInstance).catch((err) => {
      console.error('[SQL Database] Seed error:', err);
    });
  }
  return dbInstance;
}

/**
 * Executes a function within a strict database transaction.
 * Uses BEGIN IMMEDIATE to prevent write conflicts and race conditions.
 */
export function runTransaction<T>(fn: () => T): T {
  const db = getDb();
  db.exec('BEGIN IMMEDIATE TRANSACTION;');
  try {
    const result = fn();
    db.exec('COMMIT;');
    return result;
  } catch (error) {
    try {
      db.exec('ROLLBACK;');
    } catch (rollbackErr) {
      console.error('[SQL Database] Rollback failed:', rollbackErr);
    }
    throw error;
  }
}

/**
 * Seed baseline verified accounts if database is fresh
 */
async function seedInitialAccounts(db: DatabaseSync): Promise<void> {
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM users');
  const result = countStmt.get() as { count: number };
  if (result.count === 0) {
    console.log('[SQL Database] Seeding baseline verified student accounts...');
    
    // Default account for Jhazzley Pore (Current User Context)
    const jhazzleyId = 'usr_jhazzley_lv1001';
    const jhazzleyHash = await hashPassword('JhazzleySecure2026!');
    const now = new Date().toISOString();

    const insertUser = db.prepare(`
      INSERT INTO users (user_id, first_name, last_name, google_account, password_hash, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const insertProfile = db.prepare(`
      INSERT INTO user_profiles (profile_id, user_id, account_type, skill, bio, campus, avatar_url, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertUser.run(
      jhazzleyId,
      'Jhazzley',
      'Pore',
      'jhazzley.pore@student.laverdad.edu.ph',
      jhazzleyHash,
      now,
      now
    );

    insertProfile.run(
      'prof_jhazzley_01',
      jhazzleyId,
      'Freelancer',
      'Full Stack Web Developer & UI Designer',
      'BS Computer Science student passionate about accessible software and responsive web apps.',
      'La Verdad Christian College',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      now,
      now
    );

    // Second demo account for testing multiple users & isolation
    const joshuaId = 'usr_joshua_lv1002';
    const joshuaHash = await hashPassword('studentpass123');

    insertUser.run(
      joshuaId,
      'Joshua',
      'Mislang',
      'joshua.student@lvskillsync.edu',
      joshuaHash,
      now,
      now
    );

    insertProfile.run(
      'prof_joshua_02',
      joshuaId,
      'Freelancer',
      'Mobile App Developer & UI/UX Specialist',
      'LV student developer specializing in cross-platform mobile apps.',
      'La Verdad Christian College',
      'https://i.pravatar.cc/150?u=u1',
      now,
      now
    );

    console.log('[SQL Database] Baseline accounts successfully seeded.');
  }
}
