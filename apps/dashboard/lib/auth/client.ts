"use client";

import { useUser, useAuth } from "@clerk/nextjs";

/**
 * Hook to get the current authenticated Clerk user (client-side)
 */
export function useCurrentUser() {
  return useUser();
}

/**
 * Hook to get auth state (client-side)
 */
export function useAuthState() {
  return useAuth();
}

