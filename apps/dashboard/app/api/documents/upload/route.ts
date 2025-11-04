import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/server";
import { getClientByClerkUserId } from "@/lib/db";
import { db, documents } from "@workspace/database";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const clerkUserId = await requireAuth();
    const client = await getClientByClerkUserId(clerkUserId);

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const clientId = formData.get("clientId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (clientId !== client.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // TODO: Upload file to Vercel Blob or S3
    // For now, we'll just create the document record
    // In production, upload the file first and get the storage URL

    const fileType = file.name.split(".").pop()?.toLowerCase() || "unknown";
    const allowedTypes = ["pdf", "docx", "txt"];

    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { error: "File type not supported" },
        { status: 400 }
      );
    }

    // Create document record
    // TODO: Replace with actual storage URL after uploading
    const storageUrl = `placeholder://${file.name}`;

    const document = await db
      .insert(documents)
      .values({
        clientId: client.id,
        filename: file.name,
        originalFilename: file.name,
        fileType,
        fileSize: file.size,
        storageUrl,
        status: "pending",
      })
      .returning();

    // TODO: Queue processing job

    return NextResponse.json({ document: document[0] });
  } catch (error) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
}

