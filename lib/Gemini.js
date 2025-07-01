import axios from "axios";

export default async function Gemini(placeName) {
  try {
    const res = await axios.post("/api/gemini/route", { placeName });
    const data = res.data;
    return data.result || "Failed to generate content";
  } catch (error) {
    console.error("Error calling Gemini API route:", error);
    return "Failed to generate content";
  }
}