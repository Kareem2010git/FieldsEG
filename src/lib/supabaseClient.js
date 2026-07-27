import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rjfvqszphbuvbevzjkpf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZnZxc3pwaGJ1dmJldnpqa3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxMDY0ODAsImV4cCI6MjEwMDY4MjQ4MH0.ffQ2D2We0V5v0_h7fK9W2K-xVFjqXSBCW9tNZiLXfwU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)