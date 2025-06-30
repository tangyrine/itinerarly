import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_Gemini_API });

export default async function Gemini(placeName) {
  const models = ["gemini-2.0-flash", "gemini-2.5-flash"];
  let currentModelIndex = 0;

  async function tryGenerate() {
    try {
      const response = await ai.models.generateContent({
        model: models[currentModelIndex],
        contents: `Return ONLY a valid JSON object with these keys: "bestTime", "attractions" (array of objects with "name" and "coordinates" [lat,lon]), "food" (array). 
Example: {"bestTime":"October to March","attractions":[{"name":"Red Fort","coordinates":[28.6562,77.2410]},{"name":"Qutub Minar","coordinates":[28.5244,77.1855]}],"food":["Chaat","Butter Chicken","Paratha"]} 
For the place: ${placeName}`
        ,
      });
      return response.text;
    } catch (error) {
      if (error.message?.includes('rate limit') && currentModelIndex < models.length - 1) {
        currentModelIndex++;
        return tryGenerate();
      }
      console.error("Error generating content:", error);
      return "Failed to generate content";
    }
  }

  return tryGenerate();
}