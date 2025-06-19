import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_Gemini_API });

export default async function Gemini(placeName) {
  try{
    const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Return two points in less than 25 words
              1. Best time to visit ${placeName}
              2. Top three attractions in ${placeName}`,
  });
  return response.text;
} catch (error) {
    console.error("Error generating content:", error);
    return "Failed to generate content";
  }
}

