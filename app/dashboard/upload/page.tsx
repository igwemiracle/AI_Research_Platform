import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UploadForm } from "@/components/upload-form";

export default async function UploadPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <UploadForm />
    </div>
  );
}