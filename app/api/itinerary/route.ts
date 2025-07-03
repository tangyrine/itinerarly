import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const formData = body?.formData;
    // Input validation
    if (
      !formData ||
      typeof formData !== "object" ||
      typeof formData.destination !== "string" ||
      formData.destination.trim() === "" ||
      typeof formData.people !== "string" ||
      formData.people.trim() === "" ||
      typeof formData.days !== "string" ||
      formData.days.trim() === "" ||
      typeof formData.budget !== "string" ||
      formData.budget.trim() === ""
    ) {
      return new Response(
        JSON.stringify({
          error: "Invalid or missing formData. Please provide destination, people, days, and budget as non-empty strings.",
        }),
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
          contents: `
              For "${formData.destination}" in India, return the itinerary in this format, using "|||" as a delimiter between sections:
              Destination: <destination>
              Budget: <budget>
              Hotels: <hotel1>, <hotel2>, <hotel3>
              Restaurants: <restaurant1>, <restaurant2>, <restaurant3>
              Attractions: <attraction1>, <attraction2>, <attraction3>
              Day-wise Plan:
              Day 1: <activities>
              Day 2: <activities>
              Day 3: <activities>
              |||
              Example:
              Destination: Delhi
              Budget: ₹15,000 - ₹20,000
              Hotels: The Imperial, Taj Palace
              Restaurants: Karim's, Indian Accent
              Attractions: Red Fort, Qutub Minar, Lotus Temple
              Day-wise Plan:
              Day 1: Red Fort, Jama Masjid, Chandni Chowk
              Day 2: Qutub Minar, Lotus Temple, Hauz Khas Village
              Day 3: India Gate, Connaught Place, Dilli Haat
              |||
              If not a place in India, return: Error: Please search for a place in India.
              Now generate for: ${formData.destination}, ${formData.people} people, ${formData.days} days, budget: ${formData.budget} (INR). Return in 80 words or less.
            `,
        });
        let text =
          typeof response.text === "string" ? response.text.trim() : "";
        return text;
      } catch (error: any) {
        if (
          error.message?.includes("rate limit") &&
          currentModelIndex < models.length - 1
        ) {
          currentModelIndex++;
          return tryGenerate();
        }
        console.error("Gemini API error:", error);
        return { error: "Failed to generate content" };
      }
    }

    const result = await tryGenerate();
    return new Response(JSON.stringify({ result }), { status: 200 });
  } catch (err) {
    console.error("Server error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
