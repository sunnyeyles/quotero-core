import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/server";
import { getClientByClerkUserId } from "@/lib/db";
import { db, documents } from "@workspace/database";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const clerkUserId = await requireAuth();
    const client = await getClientByClerkUserId(clerkUserId);

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const searchParams = request.nextUrl.searchParams;
    const requestClientId = searchParams.get("clientId");

    if (requestClientId !== client.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const clientDocuments = await db
      .select()
      .from(documents)
      .where(eq(documents.clientId, client.id))
      .orderBy(documents.createdAt);

    return NextResponse.json({ documents: clientDocuments });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

