
import { PostgrestError, PostgrestSingleResponse, PostgrestResponse } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

/**
 * Safely extracts data from a Supabase query response
 */
export function extractData<T>(response: PostgrestSingleResponse<T> | PostgrestResponse<T>): T | T[] | null {
  if (response.error) {
    console.error('Supabase query error:', response.error);
    return null;
  }
  
  // Handle both single responses and array responses correctly
  return response.data;
}

/**
 * Safe property access with fallback for potentially undefined Supabase data
 */
export function safeGet<T, K extends keyof T>(obj: T | null | undefined, key: K, fallback: T[K]): T[K] {
  if (!obj) return fallback;
  return obj[key] !== undefined ? obj[key] : fallback;
}

/**
 * Converts a typed filter to a format Supabase can use
 */
export function createFilter<T extends keyof Database['public']['Tables']>(
  column: string, 
  value: any
): [string, any] {
  return [column, value];
}

/**
 * Safe type casting for Supabase parameters
 */
export function castParam<T>(value: any): T {
  return value as unknown as T;
}

/**
 * Represents a successful Supabase operation
 */
export interface SupabaseSuccess<T> {
  success: true;
  data: T;
  message?: string; // Optional message field
}

/**
 * Represents a failed Supabase operation
 */
export interface SupabaseError {
  success: false;
  error: PostgrestError | Error;
  message: string;
}

export type SupabaseResult<T> = SupabaseSuccess<T> | SupabaseError;

/**
 * Wrapper for Supabase operations to provide consistent error handling
 */
export async function executeSupabaseQuery<T>(
  queryFn: () => Promise<PostgrestSingleResponse<T> | PostgrestResponse<T>>
): Promise<SupabaseResult<T>> {
  try {
    const response = await queryFn();
    
    if (response.error) {
      return {
        success: false,
        error: response.error,
        message: response.error.message
      };
    }
    
    return {
      success: true,
      data: response.data as T
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
      message: error instanceof Error ? error.message : String(error)
    };
  }
}
