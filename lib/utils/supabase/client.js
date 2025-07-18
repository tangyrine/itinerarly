'use client'

import { createBrowserClient } from '@supabase/ssr'

const createClientForBrowser = () =>
  createBrowserClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
  )

export default createClientForBrowser