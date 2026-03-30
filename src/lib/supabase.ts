import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gnhmveamzymuxlsymsuw.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduaG12ZWFtenltdXhsc3ltc3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MzcwMjEsImV4cCI6MjA4OTExMzAyMX0.cliTxwWBMJXP6U-B-BtFkaUAY857D819f4ekXbkRgpY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
