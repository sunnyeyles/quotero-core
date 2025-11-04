import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/server";
import { getClientByClerkUserId } from "@/lib/db";
import { db, documents } from "@workspace/database";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const clerkUserId = await requireAuth();
    const client = await getClientByClerkUserId(clerkUserId);

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const { id } = await params;

    const document = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);

    if (!document[0]) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (document[0].clientId !== client.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete document (cascade will handle chunks and embeddings)
    await db.delete(documents).where(eq(documents.id, id));

    // TODO: Delete file from storage

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}

