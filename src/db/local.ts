import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

export function getLocalDb(path: string) {
    const sqlite = new Database(path);
    return drizzle(sqlite, { schema });
}
