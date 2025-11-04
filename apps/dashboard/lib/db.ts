import { getPrisma } from "@workspace/database";
import crypto from "crypto";

/**
 * Get client by Clerk user ID
 */
export async function getClientByClerkUserId(clerkUserId: string) {
  try {
    const prisma = getPrisma();
    return await prisma.client.findFirst({
      where: { clerkUserId },
    });
  } catch (error) {
    console.warn("DB unavailable in getClientByClerkUserId:", error);
    return null;
  }
}

/**
 * Get client by API key
 */
export async function getClientByApiKey(apiKey: string) {
  try {
    const prisma = getPrisma();
    return await prisma.client.findFirst({
      where: { apiKey },
    });
  } catch (error) {
    console.warn("DB unavailable in getClientByApiKey:", error);
    return null;
  }
}

/**
 * Create a new client linked to a Clerk user
 */
export async function createClientForClerkUser(
  clerkUserId: string,
  name: string,
  slug: string
) {
  // Generate API key
  const apiKey = `sk_${crypto.randomBytes(32).toString("hex")}`;
  try {
    const prisma = getPrisma();
    return await prisma.client.create({
      data: {
        name,
        slug,
        apiKey,
        clerkUserId,
      },
    });
  } catch (error) {
    console.error("Failed to create client (DB unavailable?):", error);
    throw error;
  }
}

/**
 * Generate a unique slug from a name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
