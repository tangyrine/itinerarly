'use server'

import { createClientForServer } from '@/lib/utils/supabase/server'
import { redirect } from 'next/navigation'

const signOut = async () => {
  const supabase = await createClientForServer()
  await supabase.auth.signOut()
}

export { signOut }