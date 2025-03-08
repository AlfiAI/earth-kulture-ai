
import { processWorldBankData, processOECDData, processWebData } from "./processors.ts";

// Define data sources
export const DATA_SOURCES = [
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
  }
];

// Fetch data from a specific source
async function fetchFromSource(source: any) {
  console.log(`Fetching data from ${source.name}: ${source.url}`);
  
  try {
    const response = await fetch(source.url);
    
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
      next_update: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week later
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
