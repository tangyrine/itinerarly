import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_Gemini_API });

export default async function Gemini() {
  try{
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain why sun is yellow in 30 words",
  });
  return response.text;
} catch (error) {
    console.error("Error generating content:", error);
    return "Failed to generate content";
  }
}

