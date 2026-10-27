import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

/** Migrations need the direct (unpooled) connection; PgBouncer drops session state. */
const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url)
	throw new Error(
		"Set DATABASE_URL_UNPOOLED (run `vercel env pull .env.local`)",
	);

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/server/db/schema.ts",
	out: "./drizzle",
	dbCredentials: { url },
	strict: true,
});
