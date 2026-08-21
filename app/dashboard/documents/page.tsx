import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DocumentList } from "@/components/document-list";

export default async function DocumentsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const documents = await prisma.document.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fileName: true,
      fileSize: true,
      createdAt: true,
      status: true,
      errorMessage: true,
      // extractedText intentionally excluded — not needed for the list view,
      // and could be large per document
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <DocumentList documents={documents} />
    </div>
  );
}