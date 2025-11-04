import { PrismaClient } from "@prisma/client";

// Singleton pattern for Prisma Client
// Prevents multiple instances in development with hot reloading
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Export getPrisma function for consistency (alias to prisma)
export function getPrisma() {
  return prisma;
}

// Export Prisma types
export type { Prisma } from "@prisma/client";
