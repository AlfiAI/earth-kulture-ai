
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ihijlloxwfjrrnhxqlfa.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaWpsbG94d2ZqcnJuaHhxbGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNDIzNTksImV4cCI6MjA1NjkxODM1OX0.DyjXR0ZvK9lNjZ7BXelUOOErzHQnCOcda1X1StkMlks";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
