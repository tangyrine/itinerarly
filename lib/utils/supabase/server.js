import { createServerClient } from '@supabase/ssr'
import { error } from 'console'
import { cookies } from 'next/headers'

export async function createClientForServer() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        })
                    } catch {
                        console.log(error)
                        
                    }
                },
            },
        },
    )
}