
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ihijlloxwfjrrnhxqlfa.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaWpsbG94d2ZqcnJuaHhxbGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNDIzNTksImV4cCI6MjA1NjkxODM1OX0.DyjXR0ZvK9lNjZ7BXelUOOErzHQnCOcda1X1StkMlks";

// Get the current site URL dynamically to properly handle redirects
const getSiteUrl = () => {
  // In browser environment
  if (typeof window !== 'undefined') {
    // First check if we're in a preview environment
    if (window.location.hostname.includes('preview--') || 
        window.location.hostname.includes('lovable.app')) {
      return window.location.origin;
    }
    
    // For local development or other deployments
    const url = new URL(window.location.href);
    return `${url.protocol}//${url.host}`;
  }
  // Fallback for non-browser environments
  return 'http://localhost:8080';
};

// Configure auth redirect URLs
const redirectUrl = `${getSiteUrl()}/auth`;
console.log("Auth redirects configured to:", redirectUrl);

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
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
    },
    global: {
      headers: {
        'x-application-name': 'esg-carbon-tracker'
      }
    }
  }
);

// Helper to safely handle potentially undefined data from Supabase queries
export function handleQueryResult<T>(result: { data: T | null, error: Error | null }): T | null {
  if (result.error) {
    console.error("Supabase query error:", result.error);
    return null;
  }
  return result.data;
}

// Type-safe filter helper - use this instead of direct string parameters
export function createFilter<T extends keyof Database['public']['Tables']>(
  table: T, 
  column: keyof Database['public']['Tables'][T]['Row'],
  value: any
) {
  return {
    table,
    column,
    value
  };
}
