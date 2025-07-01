export async function GET(req: Request) {
  const { searchParams } = new URL(req.url!);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const resp = await fetch(url);
  const data = await resp.json();
  return new Response(JSON.stringify(data), { status: 200 });
}