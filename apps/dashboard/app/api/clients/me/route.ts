import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/server";
import { getClientByClerkUserId } from "@/lib/db";

/**
 * Get the current client for the authenticated Clerk user
 */
export async function GET() {
  try {
    const clerkUserId = await requireAuth();
    const client = await getClientByClerkUserId(clerkUserId);

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Don't expose API key in response
    const { apiKey, ...safeClient } = client;

    return NextResponse.json({ client: safeClient });
  } catch (error) {
    console.error("Error getting client:", error);
    return NextResponse.json(
      { error: "Failed to get client" },
      { status: 500 }
    );
  }
}

