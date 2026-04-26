import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    "https://kmaqpcdohjtujnomfqnh.supabase.co",
    "sb_publishable_9X-ZI6ipbYcH9J97T0G_Ww_l-etOkPW"
  )
}
