
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { connect } from "https://deno.land/x/redis@v0.29.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://ihijlloxwfjrrnhxqlfa.supabase.co';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const REDIS_URL = Deno.env.get('REDIS_URL') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting ESG insights generation job');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id');
      
    if (usersError) {
      throw new Error(`Error fetching users: ${usersError.message}`);
    }
    
    const insights = [];
    
    // Generate insights for each user
    for (const user of users || []) {
      // Get user's carbon emissions
      const { data: emissions, error: emissionsError } = await supabase
        .from('carbon_emissions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(100);
        
      if (emissionsError) {
        console.error(`Error fetching emissions for user ${user.id}: ${emissionsError.message}`);
        continue;
      }
      
      // Get user's ESG data
      const { data: esgData, error: esgError } = await supabase
        .from('esg_data')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(100);
        
      if (esgError) {
        console.error(`Error fetching ESG data for user ${user.id}: ${esgError.message}`);
        continue;
      }
      
      // Get user's compliance status
      const { data: compliance, error: complianceError } = await supabase
        .from('compliance_status')
        .select('*, compliance_frameworks(*)')
        .eq('user_id', user.id);
        
      if (complianceError) {
        console.error(`Error fetching compliance for user ${user.id}: ${complianceError.message}`);
        continue;
      }
      
      // Generate insights based on the data
      if (emissions && emissions.length > 0) {
        // Calculate trends in emissions
        const recentEmissions = emissions.slice(0, 6); // Last 6 months
        const totalRecentEmissions = recentEmissions.reduce((sum, em) => sum + Number(em.amount), 0);
        const avgRecentEmissions = totalRecentEmissions / recentEmissions.length;
        
        // If we have enough historical data for comparison
        if (emissions.length > 12) {
          const olderEmissions = emissions.slice(6, 12); // 6 months before recent
          const totalOlderEmissions = olderEmissions.reduce((sum, em) => sum + Number(em.amount), 0);
          const avgOlderEmissions = totalOlderEmissions / olderEmissions.length;
          
          const changePercent = ((avgRecentEmissions - avgOlderEmissions) / avgOlderEmissions) * 100;
          
          // Create insight
          insights.push({
            user_id: user.id,
            type: 'trend',
            title: `Carbon Emissions ${changePercent < 0 ? 'Decreased' : 'Increased'}`,
            description: `Your carbon emissions have ${changePercent < 0 ? 'decreased' : 'increased'} by ${Math.abs(changePercent).toFixed(1)}% compared to the previous 6 months.`,
            indicator: changePercent < 0 ? 'down' : 'up',
            percentageChange: changePercent,
            priority: Math.abs(changePercent) > 15 ? 'high' : 'medium',
            category: 'carbon'
          });
        }
        
        // Add to Redis cache if available
        try {
          if (REDIS_URL) {
            const redis = await connect({
              hostname: REDIS_URL.split(':')[0],
              port: parseInt(REDIS_URL.split(':')[1] || "6379"),
            });
            
            // Cache insights with TTL of 1 day
            await redis.set(`user:${user.id}:carbon_trend`, JSON.stringify({
              avg_emissions: avgRecentEmissions,
              total_emissions: totalRecentEmissions,
              updated_at: new Date().toISOString()
            }), { ex: 86400 });
            
            await redis.close();
          }
        } catch (redisError) {
          console.error(`Redis caching error: ${redisError.message}`);
        }
      }
      
      // Generate compliance insights
      const nonCompliantFrameworks = compliance?.filter(c => c.status === 'non-compliant').length || 0;
      if (nonCompliantFrameworks > 0) {
        insights.push({
          user_id: user.id,
          type: 'alert',
          title: 'Compliance Risks Detected',
          description: `You have ${nonCompliantFrameworks} non-compliant frameworks that require attention.`,
          priority: 'high',
          category: 'compliance'
        });
      }
    }
    
    // Store generated insights in the database
    if (insights.length > 0) {
      for (const insight of insights) {
        const { error: insertError } = await supabase
          .from('reports')
          .insert({
            user_id: insight.user_id,
            report_type: 'ai_insight',
            ai_generated: true,
            file_url: JSON.stringify(insight)
          });
          
        if (insertError) {
          console.error(`Error storing insight: ${insertError.message}`);
        }
      }
      
      console.log(`Generated and stored ${insights.length} insights`);
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Generated ${insights.length} insights`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ESG insights generation:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
