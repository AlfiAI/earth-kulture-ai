
// CORS Headers for all requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create Supabase client
export function createClient(supabaseUrl: string, supabaseKey: string) {
  return {
    from: (table: string) => ({
      upsert: (data: any, options?: {onConflict?: string, ignoreDuplicates?: boolean}) => {
        return fetch(`${supabaseUrl}/rest/v1/${table}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Prefer': options?.onConflict ? `resolution=merge-duplicates,duplicate-columns=${options.onConflict}` : '',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify(data)
        }).then(res => res.json())
          .then(data => ({ data, error: null }))
          .catch(error => ({ data: null, error }));
      }
    })
  };
}
