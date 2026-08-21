import { extractText, getDocumentProxy } from "unpdf";

// Extracts text and page count from a PDF file buffer
export async function extractTextFromPdf(
  fileBuffer: Uint8Array
): Promise<{ text: string; pageCount: number }> {
  const pdf = await getDocumentProxy(fileBuffer);
  const { text, totalPages } = await extractText(pdf, { mergePages: true });

  return {
    text: text.trim(),
    pageCount: totalPages,
  };
}