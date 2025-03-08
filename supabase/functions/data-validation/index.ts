
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://ihijlloxwfjrrnhxqlfa.supabase.co';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting data validation job');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    
    // Fetch all ESG data from the past week
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    
    const { data: esgData, error: esgError } = await supabase
      .from('esg_data')
      .select('*')
      .gte('created_at', oneWeekAgo.toISOString());
      
    if (esgError) {
      throw new Error(`Error fetching ESG data: ${esgError.message}`);
    }
    
    // Process the data to check for common issues
    const validationIssues = [];
    
    // Check for missing values
    for (const record of esgData || []) {
      if (!record.value && record.value !== 0) {
        validationIssues.push({
          id: record.id,
          issue: 'missing_value',
          message: `Missing value for ${record.metric_name}`
        });
      }
      
      if (!record.date) {
        validationIssues.push({
          id: record.id,
          issue: 'missing_date',
          message: `Missing date for ${record.metric_name}`
        });
      }
    }
    
    // Check for outliers in numeric values
    const metricGroups = {};
    esgData?.forEach(record => {
      if (!metricGroups[record.metric_name]) {
        metricGroups[record.metric_name] = [];
      }
      metricGroups[record.metric_name].push(record.value);
    });
    
    // Use standard deviation to detect outliers
    for (const [metric, values] of Object.entries(metricGroups)) {
      if (values.length >= 5) { // Need enough data points
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
        const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
        const stdDev = Math.sqrt(variance);
        
        // Check each record for being outside 3 standard deviations
        esgData?.forEach(record => {
          if (record.metric_name === metric && 
              Math.abs(record.value - mean) > 3 * stdDev) {
            validationIssues.push({
              id: record.id,
              issue: 'outlier',
              message: `Outlier detected for ${record.metric_name}: value ${record.value} is far from mean ${mean.toFixed(2)}`
            });
          }
        });
      }
    }
    
    // Store validation results in the database
    if (validationIssues.length > 0) {
      const { error: insertError } = await supabase
        .from('reports')
        .insert({
          report_type: 'data_validation',
          ai_generated: true,
          file_url: JSON.stringify(validationIssues)
        });
        
      if (insertError) {
        throw new Error(`Error storing validation issues: ${insertError.message}`);
      }
      
      console.log(`Stored ${validationIssues.length} validation issues`);
    } else {
      console.log('No validation issues found');
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Data validation completed with ${validationIssues.length} issues found`,
      issues: validationIssues
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in data validation function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
