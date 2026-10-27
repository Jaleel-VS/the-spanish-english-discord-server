import { attachDatabasePool } from "@vercel/functions";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let pool: Pool | undefined;
let database: NodePgDatabase<typeof schema> | undefined;

/**
 * One pooled connection per server instance, created on first use so the URL
 * is read at request time. `attachDatabasePool` lets Vercel Fluid compute
 * close idle clients before the instance suspends; elsewhere it does nothing.
 */
export function db() {
	if (!database) {
		const url = process.env.DATABASE_URL;
		if (!url) throw new Error("DATABASE_URL is not set");
		// The integration's URL says sslmode=require, which pg 8 already treats as
		// verify-full but warns about on every cold start. Say verify-full outright.
		const connectionString = new URL(url);
		connectionString.searchParams.set("sslmode", "verify-full");
		pool = new Pool({ connectionString: connectionString.href, max: 5 });
		attachDatabasePool(pool);
		database = drizzle({ client: pool, schema });
	}
	return database;
}

/** For one-off scripts (seeding), which must release the pool to exit. */
export async function closeDb() {
	await pool?.end();
	pool = undefined;
	database = undefined;
}
