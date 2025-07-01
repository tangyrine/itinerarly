import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { placeName } = await req.json();
    if (!placeName || typeof placeName !== "string" || placeName.trim() === "") {
      return new Response(JSON.stringify({ error: "Invalid or missing placeName in request." }), { status: 400 });
    }
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set in environment variables.");
      return new Response(JSON.stringify({ error: "Server misconfiguration: Gemini API key is missing." }), { status: 500 });
    }
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const models = ["gemini-2.0-flash", "gemini-2.5-flash"];
    let currentModelIndex = 0;

    async function tryGenerate() {
      try {
        const response = await ai.models.generateContent({
          model: models[currentModelIndex],
          contents: `Return ONLY a valid JSON object with these keys: "bestTime", "attractions" (array of objects with "name" and "coordinates" [lat,lon]), "food" (array). 
Example: {"bestTime":"October to March","attractions":[{"name":"Red Fort","coordinates":[28.6562,77.2410]},{"name":"Qutub Minar","coordinates":[28.5244,77.1855]}],"food":["Chaat","Butter Chicken","Paratha"]} 
For the place: ${placeName}`
        });
        return response.text;
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof (error as { message?: unknown }).message === "string" &&
          (error as { message: string }).message.includes('rate limit') &&
          currentModelIndex < models.length - 1
        ) {
          currentModelIndex++;
          return tryGenerate();
        }
        return "Failed to generate content";
      }
    }

    const result = await tryGenerate();
    return new Response(JSON.stringify({ result }), { status: 200 });
  } catch (err) {
    console.error("Gemini API route error:", err);
    let errorMessage = "Server error";
    if (typeof err === "object" && err !== null && "message" in err && typeof (err as { message?: unknown }).message === "string") {
      if ((err as { message: string }).message.includes("rate limit")) {
        errorMessage = "Gemini API rate limit exceeded. Please try again later.";
      } else {
        errorMessage = (err as { message: string }).message;
      }
    }
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}