import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UploadForm } from "@/components/upload-form";

export default async function UploadPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight">Upload New Document</h2>
        <p className="text-xs text-muted-foreground">
          Upload PDF documents to parse text, generate semantic embeddings, and enable AI question answering.
        </p>
      </div>

      <UploadForm />
    </div>
  );
}