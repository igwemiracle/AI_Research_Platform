"use client";

import { Fragment, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, RotateCw } from "lucide-react";
import { processDocument } from "@/app/actions/processDocument";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

type DocumentStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

type Document = {
  id: string;
  fileName: string;
  fileSize: number;
  createdAt: Date;
  status: DocumentStatus;
  errorMessage: string | null;
};

const statusConfig: Record<
  DocumentStatus,
  {
    label: string;
    variant: "secondary" | "outline" | "default" | "destructive";
  }
> = {
  PENDING: { label: "Waiting to process", variant: "secondary" },
  PROCESSING: { label: "Processing", variant: "outline" },
  COMPLETED: { label: "Ready", variant: "default" },
  FAILED: { label: "Failed", variant: "destructive" },
};

function formatFileSize(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(2)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function DocumentList({ documents }: { documents: Document[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);

  function handleProcess(id: string) {
    setProcessingId(id);
    startTransition(async () => {
      await processDocument(id);
      router.refresh();
      setProcessingId(null);
    });
  }

  if (documents.length === 0) {
    return (
      <Card className="w-full max-w-3xl">
        <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <FileText className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No documents uploaded yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Your documents</CardTitle>
        <CardDescription>
          {documents.length} document{documents.length !== 1 ? "s" : ""}{" "}
          uploaded
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => {
              const { label, variant } = statusConfig[doc.status];
              const isThisRowPending = isPending && processingId === doc.id;

              const canProcess =
                doc.status === "PENDING" || doc.status === "FAILED";

              return (
                <Fragment key={doc.id}>
                  <TableRow>
                    <TableCell className="font-medium">
                      {doc.fileName}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {formatFileSize(doc.fileSize)}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {formatDate(doc.createdAt)}
                    </TableCell>

                    <TableCell>
                      <Badge variant={variant}>{label}</Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      {canProcess && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isThisRowPending}
                          onClick={() => handleProcess(doc.id)}
                        >
                          {isThisRowPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : doc.status === "FAILED" ? (
                            <>
                              <RotateCw className="mr-1 h-3 w-3" />
                              Retry
                            </>
                          ) : (
                            "Process"
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>

                  {doc.status === "FAILED" && doc.errorMessage && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="pt-0 text-xs text-destructive"
                      >
                        {doc.errorMessage}
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
