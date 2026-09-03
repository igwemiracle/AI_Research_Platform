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
      _count: {
        select: { chunks: true },
      },
    },
  });

  return <DocumentList documents={documents} />;
}