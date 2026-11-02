import fs from 'node:fs';
import path from 'node:path';
import { getDb, getDatabasePath } from '../server/db/database';

/**
 * Creates a point-in-time backup of the SQLite database.
 * Uses SQLite's VACUUM INTO command for clean, transactional backups even while the app is running.
 */
export async function backupDatabase(): Promise<string> {
  const db = getDb();
  const backupsDir = path.join(process.cwd(), 'data', 'backups');
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFileName = `backup_${timestamp}.sqlite`;
  const backupFilePath = path.join(backupsDir, backupFileName);

  console.log(`[Backup] Creating database backup at: ${backupFilePath}`);
  // VACUUM INTO creates a clean, unfragmented copy of the live database
  db.exec(`VACUUM INTO '${backupFilePath.replace(/'/g, "''")}';`);
  console.log(`[Backup] Database backup successfully created: ${backupFilePath}`);

  return backupFilePath;
}

if (require.main === module || process.argv[1]?.endsWith('backup.ts')) {
  backupDatabase()
    .then((path) => console.log('Done:', path))
    .catch((err) => {
      console.error('Backup failed:', err);
      process.exit(1);
    });
}
