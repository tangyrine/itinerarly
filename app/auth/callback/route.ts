import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request :NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/start'
  if (!next.startsWith('/')) next = '/start'

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.SUPABASE_URL ?? '',
    process.env.SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll: async () =>
          (await cookieStore)
            .getAll()
            .filter(({ name }) => name.startsWith('sb-'))
            .map(({ name, value }) => ({ name, value })),
            
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(async ({ name, value, options }) => {
            (await cookieStore).set(name, value, options);
          });
        }
      }
    }
  )

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`)
      }
      console.error("Supabase exchangeCodeForSession error:", error)
      return NextResponse.redirect(`${origin}/signin?error=auth`)
    } catch (err) {
      console.error("Supabase callback error:", err)
      return NextResponse.redirect(`${origin}/signin?error=auth`)
    }
  }
  return NextResponse.redirect(`${origin}/signin?error=auth`)
}