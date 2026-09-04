"use client";

import { useActionState, useState, useRef } from "react";
import Link from "next/link";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Loader2,
} from "lucide-react";
import { uploadDocument } from "@/app/actions/upload";
import { formatFileSize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB limit

export function UploadForm() {
  const [state, formAction, isPending] = useActionState(
    uploadDocument,
    undefined
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function validateAndSetFile(file: File | null) {
    setClientError(null);
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setClientError("Only PDF documents are supported at this time.");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setClientError(
        `File is too large (${formatFileSize(file.size)}). The maximum allowed size is 20MB.`
      );
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    validateAndSetFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    validateAndSetFile(file);
    if (fileInputRef.current && file) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
    }
  }

  function clearSelectedFile() {
    setSelectedFile(null);
    setClientError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Main Upload Dropzone & Form */}
      <div className="lg:col-span-2">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Select or Drop File
            </CardTitle>
            <CardDescription className="text-xs">
              Upload research documents, PDFs, manuals or whitepapers.
            </CardDescription>
          </CardHeader>

          {state?.success ? (
            <CardContent className="space-y-6 py-8">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-foreground">
                    Upload Complete!
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    Your PDF has been safely uploaded to object storage and registered in your library.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                  <Button asChild className="gap-2">
                    <Link href="/dashboard/documents">
                      <span>View in Documents Library</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      clearSelectedFile();
                      window.location.reload();
                    }}
                  >
                    Upload Another
                  </Button>
                </div>
              </div>
            </CardContent>
          ) : (
            <form action={formAction}>
              <CardContent className="space-y-4">
                {clientError && (
                  <Alert variant="destructive" className="text-xs">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{clientError}</AlertDescription>
                  </Alert>
                )}

                {state?.error && (
                  <Alert variant="destructive" className="text-xs">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{state.error}</AlertDescription>
                  </Alert>
                )}

                {/* Drag and Drop Container */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
                    isDragOver
                      ? "border-primary bg-primary/5 scale-[1.01]"
                      : selectedFile
                      ? "border-emerald-500/40 bg-emerald-500/5"
                      : "border-border/80 hover:border-primary/50 hover:bg-muted/30"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    id="file"
                    name="file"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-foreground">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(selectedFile.size)} • PDF Ready
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearSelectedFile();
                        }}
                        className="mt-2 h-7 gap-1 text-xs text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3.5 w-3.5" />
                        Remove file
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                        <UploadCloud className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          Drag and drop your PDF here, or{" "}
                          <span className="text-primary underline underline-offset-2">
                            browse
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF files only • Maximum size 20 MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="border-t border-border/40 pt-4">
                <Button
                  type="submit"
                  disabled={isPending || !selectedFile}
                  className="w-full gap-2 font-medium"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading to Storage...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-4 w-4" />
                      <span>Upload Document</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>

      {/* Side Guidelines & Architecture Card */}
      <div className="space-y-4">
        <Card className="border-border/60 bg-muted/20 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Processing Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-500/10 text-blue-500">
                <Zap className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-medium text-foreground">1. Text Extraction</p>
                <p className="text-muted-foreground">
                  Digital PDF layers are parsed using unpdf to cleanly extract text content.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-purple-500/10 text-purple-500">
                <Layers className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-medium text-foreground">2. Smart Chunking</p>
                <p className="text-muted-foreground">
                  Text is split into semantic chunks with overlap to preserve context across passages.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-500">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-medium text-foreground">3. Vector Indexing</p>
                <p className="text-muted-foreground">
                  Generates 768-dim embeddings stored with pgvector for instant cosine similarity queries.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-xl border border-border/40 p-4 text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">Tips for best results:</p>
          <p>• Avoid scanned images without OCR text layers.</p>
          <p>• Textbooks, research PDFs, and reports perform best.</p>
        </div>
      </div>
    </div>
  );
}