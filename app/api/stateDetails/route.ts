import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { placeName } = await req.json();
    if (
      !placeName ||
      typeof placeName !== "string" ||
      placeName.trim() === ""
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing placeName in request." }),
        { status: 400 }
      );
    }
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set in environment variables.");
      return new Response(
        JSON.stringify({
          error: "Server misconfiguration: Gemini API key is missing.",
        }),
        { status: 500 }
      );
    }
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const models = ["gemini-2.0-flash", "gemini-2.5-flash"];
    let currentModelIndex = 0;

    async function tryGenerate() {
      try {
        const response = await ai.models.generateContent({
          model: models[currentModelIndex],
          contents: `Return ONLY a valid JSON object with these exact keys:
          
          - "attractions": array of objects with each having "name" (string), "description" (string), and "maps_link" (string with Google Maps URL)
          - "hidden_gems": array of objects with each having "name" (string), "description" (string), and "maps_link" (string with Google Maps URL)
          - "footfall": object with "domestic" and "international" numbers
          - "best_time": string
          - "avoid": object with "places" array and "food" array
          - "safety_security": number from 1-5 based on tourist safety
          - "info": string with general travel advice

          Focus on ${placeName} and include:
          1. Top 5 tourist attractions with exact Google Maps links
          2. Top 3 non-touristy hidden gems that locals love
          3. Current tourist footfall estimates
          4. Best time to visit
          5. Places and foods to avoid
          6. Safety rating (1-5)
          7. Additional travel information

          Format maps links as proper Google Maps URLs (https://maps.google.com/?q=...).
          Return raw JSON only, no markdown, no code blocks, no backticks.`,
        });
        return response.text;
      } catch (error) {
        const errorMsg =
          typeof error === "object" && error && "message" in error
            ? (error as any).message
            : String(error);
        if (
          errorMsg?.includes("rate limit") &&
          currentModelIndex < models.length - 1
        ) {
          currentModelIndex++;
          return tryGenerate();
        }
        console.error("Gemini API error:", errorMsg);
        return `Failed to generate content: ${errorMsg}`;
      }
    }

    const result = await tryGenerate();
    return new Response(JSON.stringify({ result }), { status: 200 });
  } catch (err) {
    console.error("Gemini API route error:", err);
    let errorMessage = "Server error";
    if (
      typeof err === "object" &&
      err !== null &&
      "message" in err &&
      typeof (err as { message?: unknown }).message === "string"
    ) {
      if ((err as { message: string }).message.includes("rate limit")) {
        errorMessage =
          "Gemini API rate limit exceeded. Please try again later.";
      } else {
        errorMessage = (err as { message: string }).message;
      }
    }
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}