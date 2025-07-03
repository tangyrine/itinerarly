import axios from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url!);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  try {
    const resp = await axios.get(url);
    if (resp.status !== 200) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch weather data." }),
        { status: resp.status }
      );
    }
    return new Response(JSON.stringify(resp.data), { status: 200 });
  } catch (error) {
    console.error("Weather API error:", error);
    return new Response(
      JSON.stringify({ error: "Unable to retrieve weather information at this time." }),
      { status: 500 }
    );
  }
}