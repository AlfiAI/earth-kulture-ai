
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define data sources
const DATA_SOURCES = [
  {
    name: 'World Bank Climate Data',
    url: 'https://api.worldbank.org/v2/country/all/indicator/EN.ATM.CO2E.PC?format=json&per_page=100&date=2019',
    category: 'emissions',
    sourceType: 'api',
    dataProcessor: processWorldBankData
  },
  {
    name: 'OECD Environmental Indicators',
    url: 'https://stats.oecd.org/sdmx-json/data/AIR_GHG/TOTAL.CO2.GHG_CAP/all?startTime=2018&endTime=2019&dimensionAtObservation=allDimensions',
    category: 'emissions',
    sourceType: 'api',
    dataProcessor: processOECDData
  }
];

// Process World Bank climate data
function processWorldBankData(data) {
  try {
    if (!data || !data[1] || !Array.isArray(data[1])) {
      return { 
        error: 'Invalid World Bank data format', 
        processed: [] 
      };
    }
    
    const processed = data[1].map(item => ({
      country: item.country.value,
      indicator: item.indicator.value,
      year: item.date,
      value: item.value || 0
    }));
    
    return {
      processed,
      metadata: {
        count: processed.length,
        source: 'World Bank',
        indicator: 'CO2 emissions (metric tons per capita)',
        updated: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error processing World Bank data:', error);
    return { error: error.message, processed: [] };
  }
}

// Process OECD data
function processOECDData(data) {
  try {
    if (!data || !data.dataSets || !data.dataSets[0] || !data.dataSets[0].observations) {
      return { 
        error: 'Invalid OECD data format', 
        processed: [] 
      };
    }
    
    // This is a simplified processor - actual OECD SDMX-JSON is complex
    const observations = data.dataSets[0].observations;
    const processed = Object.keys(observations).map(key => {
      const parts = key.split(':');
      return {
        country: `Country-${parts[0]}`, // Simplified - would need dimension mapping
        indicator: 'Greenhouse Gas Emissions',
        year: '2019',
        value: observations[key][0] || 0
      };
    });
    
    return {
      processed,
      metadata: {
        count: processed.length,
        source: 'OECD',
        indicator: 'Greenhouse Gas Emissions (kg/capita)',
        updated: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error processing OECD data:', error);
    return { error: error.message, processed: [] };
  }
}

// Fetch data from a specific source
async function fetchFromSource(source) {
  console.log(`Fetching data from ${source.name}: ${source.url}`);
  
  try {
    const response = await fetch(source.url);
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    const processed = source.dataProcessor(data);
    
    return {
      source: source.name,
      dataset_name: source.name,
      dataset_description: `Data from ${source.name}`,
      data: processed,
      category: source.category,
      last_updated: new Date().toISOString(),
      next_update: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week later
      metrics: ['emissions', 'climate']
    };
  } catch (error) {
    console.error(`Error fetching from ${source.name}:`, error);
    return {
      source: source.name,
      dataset_name: source.name,
      dataset_description: `Failed to fetch data from ${source.name}`,
      data: { error: error.message },
      category: source.category,
      last_updated: new Date().toISOString(),
      next_update: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Try again tomorrow
      metrics: []
    };
  }
}

// Store fetched data in the database
async function storeExternalData(results) {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = Deno.env.toObject();
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase credentials");
  }
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  // Insert data into the external_esg_datasets table
  const { data, error } = await supabase
    .from('external_esg_datasets')
    .upsert(results, { 
      onConflict: 'source,dataset_name',
      ignoreDuplicates: false // Update existing records
    });
    
  if (error) {
    console.error("Error storing external data:", error);
    throw error;
  }
  
  return { inserted: results.length, data };
}

// Create Supabase client
function createClient(supabaseUrl, supabaseKey) {
  return {
    from: (table) => ({
      upsert: (data, options) => {
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Fetching external ESG datasets");
    
    // Fetch data from all sources
    const fetchPromises = DATA_SOURCES.map(source => fetchFromSource(source));
    const fetchedData = await Promise.all(fetchPromises);
    
    console.log(`Fetched ${fetchedData.length} datasets`);
    
    // Store data in the database
    const result = await storeExternalData(fetchedData);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully fetched and stored ${result.inserted} ESG datasets`,
        count: fetchedData.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error in fetch-external-datasets function:", error);
    
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
