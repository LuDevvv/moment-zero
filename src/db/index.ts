import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";

interface CloudflareEnv {
    DB: D1Database;
}

export async function getDb() {
    try {
        // Intenta obtener el contexto de Cloudflare (Producción)
        const { env } = await getCloudflareContext();
        // Safe cast or check
        const cfEnv = env as unknown as CloudflareEnv;

        if (cfEnv?.DB) {
            return drizzle(cfEnv.DB, { schema });
        }
    } catch (e) {
        // Ignorar si no estamos en workers
    }

    // Fallback a SQLite Local (Desarrollo)
    if (process.env.LOCAL_DB_PATH) {
        const { getLocalDb } = await import("./local");
        return getLocalDb(process.env.LOCAL_DB_PATH);
    }

    throw new Error("Falta configuración de DB (D1 o LOCAL_DB_PATH)");
}
