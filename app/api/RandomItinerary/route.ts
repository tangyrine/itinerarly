import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const formData = body?.formData || body;

    const { month, people, days, budget } = formData;
    
    if (!month || !people || !days || !budget) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields. Please provide month, people, days, and budget.",
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
          contents: `Based on the month of ${month}, suggest the BEST destination in India to visit during this time and create a detailed ${days}-day itinerary for ${people} people with a ${budget} budget in 60 words.

        Consider:
            - Weather conditions in ${month}
            - Seasonal attractions and festivals
            - Best places to visit during this specific month
            - Activities suitable for the weather

            Format your response each response should come in a new line:
            **Recommended Destination: [DESTINATION NAME]**
            
            **Why this destination is perfect for ${month}:** [Brief explanation]

            **${days}-Day Itinerary:**

            [Provide detailed day-wise itinerary with activities, places to visit, estimated costs, accommodation suggestions, and travel tips]
            **Total Estimated Budget:** [Total cost for the trip]

            Keep it practical, engaging, and show the total budget-appropriate amount at the buttom.`,
        });
        
        return response.text ?? "";
      } catch (error: any) {
        if (error.message?.includes("rate limit") && currentModelIndex < models.length - 1) {
          currentModelIndex++;
          return tryGenerate();
        }
        throw error;
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