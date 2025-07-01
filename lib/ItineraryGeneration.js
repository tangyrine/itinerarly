import axios from "axios";

export default async function ItineraryGeneration(formData) {
  try {
    const res = await axios.post("/api/itinerary/route", { formData });
    const data = res.data;
    return data.result || "Failed to generate content";
  } catch (error) {
    console.error("Error calling itinerary API:", error);
    return "Failed to generate content";
  }
}