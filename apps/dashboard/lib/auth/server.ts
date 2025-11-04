"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * Get the current authenticated Clerk user (server-side)
 */
export async function getCurrentUser() {
  return await currentUser();
}

/**
 * Get the current authenticated Clerk user ID (server-side)
 */
export async function getCurrentUserId() {
  const { userId } = await auth();
  return userId;
}

/**
 * Require authentication and return the user ID
 * Throws if user is not authenticated
 */
export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

