/* DEPRECATED: Use environment variables and supabase client from lib/supabase.ts instead */

// These are kept for backward compatibility but should be migrated to use environment variables
export const projectId = import.meta.env.VITE_SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '') || "feibuncopfcujyrlgabt";
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlaWJ1bmNvcGZjdWp5cmxnYWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NzI4ODAsImV4cCI6MjA3NzU0ODg4MH0.58a4qd84hQ4dFrsOZbbnqldW1wZSTPmZ8zDIVeUPnkQ";