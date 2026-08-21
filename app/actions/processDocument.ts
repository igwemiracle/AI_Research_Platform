"use server";

import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { extractTextFromPdf } from "@/lib/extraction";

export async function processDocument(documentId: string) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document) {
    throw new Error("Document not found.");
  }

  await prisma.document.update({
    where: { id: documentId },
    data: { status: "PROCESSING" },
  });

  try {
    const { data, error: downloadError } = await supabase.storage
      .from("documents")
      .download(document.storageKey);

    if (downloadError || !data) {
      throw new Error("Failed to download file from storage.");
    }

    const arrayBuffer = await data.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    const { text } = await extractTextFromPdf(fileBuffer);

    if (!text || text.length === 0) {
      throw new Error(
        "No extractable text found. This may be a scanned document."
      );
    }

    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "COMPLETED",
        extractedText: text,
        errorMessage: null,
      },
    });

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred.";

    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "FAILED",
        errorMessage: message,
      },
    });

    return { error: message };
  }
}