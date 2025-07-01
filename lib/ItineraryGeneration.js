import axios from "axios";

export default async function ItineraryGeneration(formData) {
  try {
    const res = await axios.post("/api/itinerary", { formData }, { timeout: 15000 }); 
    const data = res.data;
    return data.result || "Failed to generate content";
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return "Request timed out. Please try again.";
      } else if (error.response) {
        return error.response.data?.error || `Server error: ${error.response.status}`;
      } else if (error.request) {
        return "No response from server. Please check your connection.";
      } else {
        return `Request error: ${error.message}`;
      }
    } else {
      console.error("Unexpected error calling itinerary API:", error);
      return "Unexpected error occurred.";
    }
  }
}