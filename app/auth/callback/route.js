import { NextResponse } from 'next/server'
import { createClientForServer } from '@/lib/utils/supabase/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/start'
  if (!next.startsWith('/')) next = '/start'

  if (code) {
    try {
      const supabase = await createClientForServer()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`)
      }
      console.error("Supabase exchangeCodeForSession error:", error)
    } catch (err) {
      console.error("Supabase callback error:", err)
    }
  }
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}