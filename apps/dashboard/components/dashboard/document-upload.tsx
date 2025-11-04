"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface DocumentUploadProps {
  clientId: string;
}

export function DocumentUpload({ clientId }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    setError(null);
    setUploading(true);

    for (const file of acceptedFiles) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("clientId", clientId);

        const response = await fetch("/api/documents/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Upload failed");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    }

    setUploading(false);
    // Refresh the page to show new documents
    window.location.reload();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="border border-border rounded-lg p-6 bg-card">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">
          {isDragActive
            ? "Drop files here"
            : "Drag and drop files here, or click to select"}
        </p>
        <p className="text-xs text-muted-foreground">
          Supports PDF, DOCX, TXT (max 10MB)
        </p>
        {error && (
          <p className="text-sm text-destructive mt-2">{error}</p>
        )}
        {uploading && (
          <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
        )}
      </div>
    </div>
  );
}

