import * as SQLite from 'expo-sqlite';

const DB_NAME = 'budget_app.db';

// Singleton database instance
let dbInstance: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async () => {
  // If database is already initialized, return the existing instance
  if (dbInstance) {
    return dbInstance;
  }

  const db = await SQLite.openDatabaseAsync(DB_NAME);

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      note TEXT
    );
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      salary REAL DEFAULT 0,
      cycle_start_day INTEGER DEFAULT 1,
      theme TEXT DEFAULT 'system',
      notifications_enabled INTEGER DEFAULT 1
    );
    INSERT OR IGNORE INTO settings (id, salary, cycle_start_day, theme, notifications_enabled) 
    VALUES (1, 0, 1, 'system', 1);
  `);

  // Store the instance for reuse
  dbInstance = db;
  return db;
};

export const getDb = async () => {
  // If database hasn't been initialized yet, initialize it
  if (!dbInstance) {
    return await initDatabase();
  }
  // Return the existing instance
  return dbInstance;
};
