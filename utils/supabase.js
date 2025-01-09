import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ihhwhajrvkhditkpgjqv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaHdoYWpydmtoZGl0a3BnanF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0Mjk4MTQsImV4cCI6MjA1MjAwNTgxNH0.QFxRdu2tTCWjus0RFgHEVAhl0-B8zClbZ_F5nsCgqg0";

export const supabase = createClient(supabaseUrl, supabaseKey);
