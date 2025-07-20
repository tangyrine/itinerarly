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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.redirect(data.url);
} 