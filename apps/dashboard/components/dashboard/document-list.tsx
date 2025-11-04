"use client";

import { useEffect, useState } from "react";
import { FileText, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface Document {
  id: string;
  filename: string;
  originalFilename: string;
  fileType: string;
  fileSize: number;
  status: string;
  createdAt: string;
}

interface DocumentListProps {
  clientId: string;
}

export function DocumentList({ clientId }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, [clientId]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/documents?clientId=${clientId}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDocuments(documents.filter((doc) => doc.id !== documentId));
      }
    } catch (error) {
      console.error("Failed to delete document:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Loader2 className="h-4 w-4 text-gray-500 animate-spin" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>;
  }

  if (documents.length === 0) {
    return (
      <div className="border border-border rounded-lg p-12 bg-card text-center">
        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No documents uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg bg-card">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Uploaded Documents</h2>
      </div>
      <div className="divide-y divide-border">
        {documents.map((document) => (
          <div
            key={document.id}
            className="p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{document.originalFilename}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span>{formatFileSize(document.fileSize)}</span>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(document.status)}
                    <span className="capitalize">{document.status}</span>
                  </span>
                  <span>
                    {new Date(document.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(document.id)}
              className="ml-4"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

