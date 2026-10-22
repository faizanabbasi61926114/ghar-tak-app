import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ekwsebxbiedoszqqngko.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrd3NlYnhiaWVkb3N6cXFuZ2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NjE0OTcsImV4cCI6MjA2NTMzNzQ5N30.uIxZmUW8gvuFn3YZ-RUcWVd2AfAiO76kAVCLLZKA_3g'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)