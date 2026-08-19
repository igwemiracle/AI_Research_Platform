"use client";

import { useActionState, useState } from "react";
import { UploadCloud, FileText, CheckCircle2 } from "lucide-react";
import { uploadDocument } from "@/app/actions/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB, matches the server action's limit

export function UploadForm() {
  const [state, formAction, isPending] = useActionState(
    uploadDocument,
    undefined
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setClientError(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setClientError("Only PDF files are supported.");
      setSelectedFile(null);
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setClientError("File is too large. Maximum size is 20MB.");
      setSelectedFile(null);
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Upload a document</CardTitle>
        <CardDescription>PDF files only, up to 20MB.</CardDescription>
      </CardHeader>

      <form action={formAction}>
        <CardContent className="space-y-4">
          {clientError && (
            <Alert variant="destructive">
              <AlertDescription>{clientError}</AlertDescription>
            </Alert>
          )}

          {state?.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {state?.success && (
            <Alert className="border-green-500/50 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Document uploaded successfully.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="file">PDF file</Label>
            <div className="flex items-center justify-center rounded-lg border border-dashed border-input p-6">
              <div className="flex flex-col items-center gap-2 text-center">
                {selectedFile ? (
                  <>
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click below to choose a file
                    </p>
                  </>
                )}
              </div>
            </div>
            <Input
              id="file"
              name="file"
              type="file"
              accept="application/pdf"
              required
              onChange={handleFileChange}
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={isPending || !selectedFile}
          >
            {isPending ? "Uploading..." : "Upload document"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}