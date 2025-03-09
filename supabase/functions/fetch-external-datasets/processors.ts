
// Process World Bank climate data
export function processWorldBankData(data: any) {
  try {
    if (!data || !data[1] || !Array.isArray(data[1])) {
      return { 
        error: 'Invalid World Bank data format', 
        processed: [] 
      };
    }
    
    const processed = data[1].map((item: any) => ({
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
export function processOECDData(data: any) {
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

// Process scraped web data
export function processWebData(htmlContent: string) {
  // In a real implementation, you would use a proper HTML parser
  // to extract data from the web pages
  
  return {
    processed: [
      {
        indicator: 'CO2 Emissions',
        value: 'See source for latest data',
        year: new Date().getFullYear().toString(),
        source: 'Web scraping'
      }
    ],
    metadata: {
      count: 1,
      source: 'Web Scraping',
      indicator: 'Various Environmental Indicators',
      updated: new Date().toISOString()
    }
  };
}

// AI-based NLP analysis of text content
export function analyzeTextContent(text: string) {
  // This is a simplified placeholder. In a real implementation,
  // this would use an NLP model to analyze sentiment, extract entities, etc.
  
  const sentimentWords = {
    positive: ['increase', 'growth', 'improve', 'positive', 'success', 'achievement', 'progress'],
    negative: ['decrease', 'decline', 'risk', 'challenge', 'issue', 'problem', 'concern', 'threat']
  };
  
  let sentiment = 'neutral';
  let score = 0;
  
  // Simple sentiment analysis
  const lowerText = text.toLowerCase();
  
  // Count positive words
  let positiveCount = 0;
  sentimentWords.positive.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = lowerText.match(regex);
    if (matches) positiveCount += matches.length;
  });
  
  // Count negative words
  let negativeCount = 0;
  sentimentWords.negative.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = lowerText.match(regex);
    if (matches) negativeCount += matches.length;
  });
  
  // Calculate sentiment score
  score = (positiveCount - negativeCount) / (Math.max(1, positiveCount + negativeCount));
  
  if (score > 0.2) sentiment = 'positive';
  else if (score < -0.2) sentiment = 'negative';
  
  // Extract key phrases (simplified)
  const words = lowerText.split(/\W+/).filter(word => word.length > 3);
  const wordCounts: Record<string, number> = {};
  
  words.forEach(word => {
    if (!wordCounts[word]) wordCounts[word] = 0;
    wordCounts[word]++;
  });
  
  const keyPhrases = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(entry => entry[0]);
  
  return {
    sentiment,
    sentimentScore: score,
    keyPhrases,
    wordCount: words.length
  };
}

// Process climate watch data
export function processClimateWatchData(data: any) {
  try {
    if (!data || !data.data) {
      return {
        error: 'Invalid Climate Watch data format',
        processed: []
      };
    }
    
    const processed = data.data.map((item: any) => ({
      country: item.country || 'Global',
      indicator: 'GHG Emissions',
      year: item.year || new Date().getFullYear().toString(),
      value: item.value || 0,
      unit: item.unit || 'MtCO2e'
    }));
    
    return {
      processed,
      metadata: {
        count: processed.length,
        source: 'Climate Watch',
        indicator: 'Greenhouse Gas Emissions',
        updated: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error processing Climate Watch data:', error);
    return { error: error.message, processed: [] };
  }
}

// Process Sustainalytics ESG data
export function processSustainalyticsData(data: any) {
  try {
    if (!data || !data.companies) {
      return {
        error: 'Invalid Sustainalytics data format',
        processed: []
      };
    }
    
    const processed = data.companies.map((company: any) => ({
      company: company.name || 'Unknown',
      industry: company.industry || 'General',
      esg_score: company.esg_score || 0,
      risk_level: company.risk_level || 'Medium',
      year: new Date().getFullYear()
    }));
    
    return {
      processed,
      metadata: {
        count: processed.length,
        source: 'Sustainalytics',
        indicator: 'ESG Risk Ratings',
        updated: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error processing Sustainalytics data:', error);
    return { error: error.message, processed: [] };
  }
}
