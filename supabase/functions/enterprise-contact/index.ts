
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface RequestBody {
  name: string;
  email: string;
  company: string;
  message: string;
  userId: string | null;
}

serve(async (req) => {
  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      // Supabase API URL - env var exposed by default when deployed
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exposed by default when deployed
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get the request body
    const requestData: RequestBody = await req.json()
    
    // Validate request data
    if (!requestData.email || !requestData.name || !requestData.company) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    // In a real implementation, you would send an email notification or create
    // a record in a CRM system. For now, we'll just log the request.
    console.log('Enterprise contact request received:', requestData)
    
    // Store the request in the database if needed
    // This could be in a separate 'enterprise_requests' table
    
    // If the user is authenticated, create a subscription record with pending status
    if (requestData.userId) {
      const { error } = await supabaseClient
        .from('subscriptions')
        .insert({
          user_id: requestData.userId,
          plan: 'Enterprise',
          status: 'Pending',
          started_at: new Date().toISOString(),
          expires_at: null // To be determined after contact
        })
      
      if (error) {
        console.error('Error creating subscription record:', error)
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Enterprise contact request received successfully' 
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
