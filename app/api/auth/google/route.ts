import { NextRequest, NextResponse } from "next/server";
import { createClientForServer } from "@/lib/utils/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClientForServer();
  const auth_callback_url = `${req.nextUrl.origin}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${auth_callback_url}?next=/start`,
    },
  });

  if (error) {
    console.error("Supabase OAuth error:", error);
    return NextResponse.json({ error: "Authentication failed. Please try again later." }, { status: 500 });
  }

  return NextResponse.redirect(data.url);
}