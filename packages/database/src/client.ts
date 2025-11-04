import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let cachedDb: ReturnType<typeof drizzle> | null = null;

function createClient() {
  const connectionString =
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    (process.env.NODE_ENV === "development"
      ? "postgresql://postgres:postgres@localhost:5432/quotero-core"
      : null);

  if (!connectionString) {
    throw new Error(
      "Database connection string is required. Please set POSTGRES_URL or DATABASE_URL environment variable."
    );
  }

  // Disable prefetch as it is not supported for "Transaction" pool mode
  // Vercel Postgres works best with connection pooling settings
  const client = postgres(connectionString, {
    prepare: false,
    max: 10,
  });

  return drizzle(client, { schema });
}

export function getDb() {
  if (!cachedDb) {
    cachedDb = createClient();
  }
  return cachedDb;
}

export type Database = ReturnType<typeof getDb>;
export * from "./schema";
