import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
    config: { outputDimensionality: 768 },
  });

  const values = response.embeddings![0].values!;

  const magnitude = Math.sqrt(values.reduce((sum, v) => sum + v * v, 0));
  const normalized = values.map((v) => v / magnitude);

  return normalized;
}