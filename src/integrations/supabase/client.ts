
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ihijlloxwfjrrnhxqlfa.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaWpsbG94d2ZqcnJuaHhxbGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNDIzNTksImV4cCI6MjA1NjkxODM1OX0.DyjXR0ZvK9lNjZ7BXelUOOErzHQnCOcda1X1StkMlks";

// Get the current site URL dynamically to properly handle redirects
const getSiteUrl = () => {
  // In browser environment
  if (typeof window !== 'undefined') {
    // Handle preview environments correctly
    const url = new URL(window.location.href);
    return `${url.protocol}//${url.host}`;
  }
  // Fallback for non-browser environments
  return 'http://localhost:8080';
};

// Configure auth redirect URLs
const redirectTo = `${getSiteUrl()}/auth`;
console.log("Auth redirects configured to:", redirectTo);

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      redirectTo: redirectTo,
      storage: {
        getItem: (key: string) => {
          if (typeof window !== 'undefined') {
            return window.localStorage.getItem(key);
          }
          return null;
        },
        setItem: (key: string, value: string) => {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, value);
          }
        },
        removeItem: (key: string) => {
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem(key);
          }
        }
      }
    }
  }
);
