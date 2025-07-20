'use server'

import { createClientForServer } from '@/lib/utils/supabase/server'
import { redirect } from 'next/navigation'

const signOut = async () => {
  try {
    const supabase = await createClientForServer();
    await supabase.auth.signOut();
    redirect("/signin"); 
  } catch (error) {
    console.error("Sign out error:", error);
    redirect("/signin");
  }
}

export { signOut }