import { requireAuth } from "@/lib/auth/server";
import { getClientByClerkUserId } from "@/lib/db";
import { DocumentUpload } from "@/components/dashboard/document-upload";
import { DocumentList } from "@/components/dashboard/document-list";

export default async function DocumentsPage() {
  const clerkUserId = await requireAuth();
  const client = await getClientByClerkUserId(clerkUserId);

  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Documents</h1>
        <p className="text-muted-foreground mt-2">
          Upload and manage documents for your chatbot
        </p>
      </div>

      <DocumentUpload clientId={client.id} />

      <DocumentList clientId={client.id} />
    </div>
  );
}

