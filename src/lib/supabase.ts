import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gqjstpdtwaxetvknhqkb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxanN0cGR0d2F4ZXR2a25ocWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTkyNTcsImV4cCI6MjA4OTE3NTI1N30.KybxpfqKX6astS6maY6E1G0766t5FlKvVziijO0nh04'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
