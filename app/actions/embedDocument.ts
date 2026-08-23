"use server";

import { prisma } from "@/lib/prisma";
import { chunkText } from "@/lib/chunking";
import { generateEmbedding } from "@/lib/embeddings";

export async function embedDocument(documentId: string) {
  const document = await prisma.document.findUnique({ where: { id: documentId } });
  if (!document?.extractedText) throw new Error("Document has no extracted text.");

  const chunks = chunkText(document.extractedText);

  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk.text);
    const vectorString = `[${embedding.join(",")}]`;

    await prisma.$executeRaw`
      INSERT INTO "Chunk" (id, "documentId", content, "chunkIndex", embedding)
      VALUES (${crypto.randomUUID()}, ${documentId}, ${chunk.text}, ${chunk.index}, ${vectorString}::vector)
    `;
  }

  return { success: true, chunkCount: chunks.length };
}