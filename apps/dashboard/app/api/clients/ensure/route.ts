import { NextResponse } from "next/server";
import { requireAuth, getCurrentUser } from "@/lib/auth/server";
import { getClientByClerkUserId, createClientForClerkUser, generateSlug } from "@/lib/db";

/**
 * Ensure a client exists for the current Clerk user
 * Creates one if it doesn't exist
 */
export async function POST() {
  try {
    const clerkUserId = await requireAuth();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if client already exists
    let client = await getClientByClerkUserId(clerkUserId);

    if (!client) {
      // Create new client
      const name = user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.emailAddresses[0]?.emailAddress || "Client";
      
      const slug = generateSlug(name);

      client = await createClientForClerkUser(
        clerkUserId,
        name,
        slug
      );
    }

    return NextResponse.json({ client });
  } catch (error) {
    console.error("Error ensuring client:", error);
    return NextResponse.json(
      { error: "Failed to ensure client" },
      { status: 500 }
    );
  }
}

