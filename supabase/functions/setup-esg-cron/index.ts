
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Setup cron jobs for ESG data collection
async function setupCronJobs() {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = Deno.env.toObject();
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase credentials");
  }
  
  // Set up ESG scraper cron job - weekly on Sunday at 1:00 AM
  await executeSQL(`
    SELECT cron.schedule(
      'weekly-esg-scraper',
      '0 1 * * 0',
      $$
      SELECT
        net.http_post(
          url:='${SUPABASE_URL}/functions/v1/esg-scraper',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${SUPABASE_SERVICE_ROLE_KEY}"}'::jsonb,
          body:='{}'::jsonb
        ) as request_id;
      $$
    );
  `);
  
  // Set up external datasets fetching cron job - daily at 2:00 AM
  await executeSQL(`
    SELECT cron.schedule(
      'daily-external-datasets',
      '0 2 * * *',
      $$
      SELECT
        net.http_post(
          url:='${SUPABASE_URL}/functions/v1/fetch-external-datasets',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${SUPABASE_SERVICE_ROLE_KEY}"}'::jsonb,
          body:='{}'::jsonb
        ) as request_id;
      $$
    );
  `);
  
  return { success: true };
}

// Execute SQL for cron jobs
async function executeSQL(sql: string) {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = Deno.env.toObject();
  
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
    },
    body: JSON.stringify({
      sql: sql
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to execute SQL: ${error}`);
  }
  
  return await response.json();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Setting up ESG cron jobs");
    
    // Set up the cron jobs
    const result = await setupCronJobs();
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Successfully set up ESG data collection cron jobs"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error setting up cron jobs:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
