
import { processWorldBankData, processOECDData, processWebData, processClimateWatchData, processSustainalyticsData } from "./processors.ts";

// Define data sources
export const DATA_SOURCES = [
  // Carbon Emissions Data
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
  },
  {
    name: 'EPA Climate Change Indicators',
    url: 'https://www.epa.gov/climate-indicators/climate-change-indicators-greenhouse-gases',
    category: 'emissions',
    sourceType: 'web',
    dataProcessor: processWebData
  },
  {
    name: 'Climate Watch Data API',
    url: 'https://www.climatewatchdata.org/api/v1/data/historical_emissions?regions=WORLD',
    category: 'emissions',
    sourceType: 'api',
    dataProcessor: processClimateWatchData,
    refreshInterval: 7 * 24 * 60 * 60 * 1000 // Weekly
  },
  
  // Sustainability Indices
  {
    name: 'Global Carbon Atlas',
    url: 'http://www.globalcarbonatlas.org/en/CO2-emissions',
    category: 'carbon',
    sourceType: 'web',
    dataProcessor: processWebData
  },
  {
    name: 'UN SDG Indicators',
    url: 'https://unstats.un.org/sdgs/indicators/database/',
    category: 'sustainability',
    sourceType: 'web',
    dataProcessor: processWebData
  },
  {
    name: 'World Bank ESG Data API',
    url: 'https://api.worldbank.org/v2/country/all/indicator/EN.CLC.MDAT.ZS?format=json',
    category: 'sustainability',
    sourceType: 'api',
    dataProcessor: processWorldBankData,
    refreshInterval: 30 * 24 * 60 * 60 * 1000 // Monthly
  },
  
  // Corporate ESG Ratings
  {
    name: 'Sustainalytics ESG Risk Ratings',
    url: 'https://www.sustainalytics.com/esg-data',
    category: 'ratings',
    sourceType: 'web',
    dataProcessor: processSustainalyticsData,
    refreshInterval: 30 * 24 * 60 * 60 * 1000 // Monthly
  },
  {
    name: 'Refinitiv ESG Data',
    url: 'https://www.refinitiv.com/en/sustainable-finance/esg-data',
    category: 'ratings',
    sourceType: 'web',
    dataProcessor: processWebData,
    refreshInterval: 30 * 24 * 60 * 60 * 1000 // Monthly
  }
];

// Fetch data from a specific source
async function fetchFromSource(source: any) {
  console.log(`Fetching data from ${source.name}: ${source.url}`);
  
  try {
    // Add a random delay between 1-3 seconds to respect rate limits
    const delay = Math.floor(Math.random() * 2000) + 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const response = await fetch(source.url, {
      headers: {
        'User-Agent': 'Earth Kulture ESG Data Collector/1.0 (https://earthkulture.example.com; info@earthkulture.example.com)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    
    // Process differently based on source type
    let data;
    let processed;
    
    if (source.sourceType === 'api') {
      data = await response.json();
      processed = source.dataProcessor(data);
    } else if (source.sourceType === 'web') {
      const html = await response.text();
      processed = source.dataProcessor(html);
    }
    
    return {
      source: source.name,
      dataset_name: source.name,
      dataset_description: `Data from ${source.name}`,
      data: processed,
      category: source.category,
      last_updated: new Date().toISOString(),
      next_update: new Date(Date.now() + (source.refreshInterval || 7 * 24 * 60 * 60 * 1000)).toISOString(), // Default to weekly updates
      metrics: [source.category, 'climate', 'sustainability']
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

// Fetch from all sources
export async function fetchFromSources() {
  const fetchPromises = DATA_SOURCES.map(source => fetchFromSource(source));
  return Promise.all(fetchPromises);
}
