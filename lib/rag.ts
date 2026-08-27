import { GoogleGenAI } from "@google/genai";
import { searchChunks } from "@/lib/search";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const CHAT_MODEL = "gemini-3.6-flash";

interface RAGResponse {
  answer: string;
  sources: { fileName: string; content: string }[];
}

export async function generateAnswer(
  question: string,
  userId: string
): Promise<RAGResponse> {
  const chunks = await searchChunks(question, userId, 5);

  if (chunks.length === 0) {
    return {
      answer: "I couldn't find any relevant information in your documents to answer that.",
      sources: [],
    };
  }

  const context = chunks
    .map((chunk, i) => `[${i + 1}] From "${chunk.fileName}":\n${chunk.content}`)
    .join("\n\n");

  const prompt = `You are a helpful assistant answering questions based only on the provided document excerpts. If the excerpts don't contain enough information to answer, say so clearly rather than guessing.

Context:
${context}

Question: ${question}

Answer:`;

  const response = await ai.models.generateContent({
    model: CHAT_MODEL,
    contents: prompt,
  });

  return {
    answer: response.text ?? "No response generated.",
    sources: chunks.map((c) => ({ fileName: c.fileName, content: c.content })),
  };
}