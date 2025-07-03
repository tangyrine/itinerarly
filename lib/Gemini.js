import axios from "axios";

export default async function Gemini(placeName) {
  try {
    const res = await axios.post("/api/gemini", { placeName }, { timeout: 15000 }); 
    const data = res.data;
    return data.result || "Failed to generate content";
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.error("Gemini API request timed out.");
        return "Request timed out. Please try again.";
      } else if (error.response) {
        console.error("Gemini API server error:", error.response.data?.error || error.response.status);
        return error.response.data?.error || `Server error: ${error.response.status}`;
      } else if (error.request) {
        console.error("No response from Gemini API server.");
        return "No response from server. Please check your connection.";
      } else {
        console.error("Gemini API request error:", error.message);
        return `Request error: ${error.message}`;
      }
    } else {
      console.error("Unexpected error calling Gemini API:", error);
      return "Unexpected error occurred.";
    }
  }
}