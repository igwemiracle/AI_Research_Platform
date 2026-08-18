"use server";

import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function uploadDocument(
  prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to upload a document." };
  }

  const file = formData.get("file") as File;
  if (!file || file.size === 0) {
    return { error: "Please select a file." };
  }

  if (file.type !== "application/pdf") {
    return { error: "Only PDF files are allowed." };
  }

  const maxSizeBytes = 20 * 1024 * 1024; // 20MB
  if (file.size > maxSizeBytes) {
    return { error: "File is too large. Max size is 20MB." };
  }

  const storageKey = `${session.user.id}/${crypto.randomUUID()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(storageKey, file);

  if (uploadError) {
    return { error: "Upload failed. Please try again." };
  }

  await prisma.document.create({
    data: {
      userId: session.user.id,
      fileName: file.name,
      fileSize: file.size,
      storageKey,
    },
  });

  return { success: true };
}