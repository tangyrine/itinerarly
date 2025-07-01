import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_Gemini_API });

export default async function ItineraryGeneration(formData) {
  const models = ["gemini-2.0-flash", "gemini-2.5-flash"];
  let currentModelIndex = 0;

  async function tryGenerate() {
    try {
      const response = await ai.models.generateContent({
        model: models[currentModelIndex],
        contents: `
if ${formData.destination} is for a place in India but don't return "Yes ${formData.destination} is a place in India" just return the below data , in case it isn't a place in India return "Please search for a place in India" and don't return any of the below data.

After checking, generate a complete itinerary for ${formData.destination} for ${formData.people} people, for ${formData.days} days, with a ${formData.budget} budget (in INR). 
Include highly rated hotels, cafes, restaurants, and must-visit attractions within ${formData.budget}. Return just the answer in 60 words.
        `,
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