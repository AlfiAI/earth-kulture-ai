
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ihijlloxwfjrrnhxqlfa.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaWpsbG94d2ZqcnJuaHhxbGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNDIzNTksImV4cCI6MjA1NjkxODM1OX0.DyjXR0ZvK9lNjZ7BXelUOOErzHQnCOcda1X1StkMlks";

// Get the current site URL dynamically to properly handle redirects
const getSiteUrl = () => {
  // In browser environment
  if (typeof window !== 'undefined') {
    // Check for production URL patterns
    const hostname = window.location.hostname;
    
    // Handle production domains
    if (hostname.includes('lovable.app') || 
        hostname.includes('earth-kulture') || 
        hostname.endsWith('.vercel.app')) {
      return window.location.origin;
    }
    
    // For local development or other deployments
    return `${window.location.protocol}//${window.location.host}`;
  }
  
  // Fallback for non-browser environments
  return 'http://localhost:5173';
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
            try {
              return window.localStorage.getItem(key);
            } catch (error) {
              console.error("Error accessing localStorage:", error);
              return null;
            }
          }
          return null;
        },
        setItem: (key: string, value: string) => {
          if (typeof window !== 'undefined') {
            try {
              window.localStorage.setItem(key, value);
            } catch (error) {
              console.error("Error setting localStorage:", error);
            }
          }
        },
        removeItem: (key: string) => {
          if (typeof window !== 'undefined') {
            try {
              window.localStorage.removeItem(key);
            } catch (error) {
              console.error("Error removing from localStorage:", error);
            }
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
