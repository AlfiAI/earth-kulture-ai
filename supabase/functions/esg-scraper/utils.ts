
// Common CORS headers for all responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to create Supabase client
export function createClient(supabaseUrl: string, supabaseKey: string) {
  return {
    from: (table: string) => ({
      upsert: (data: any, options?: { onConflict?: string; ignoreDuplicates?: boolean }) => {
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

// Calculate impact level based on keywords
export function calculateImpactLevel(title?: string, content?: string): string {
  const text = `${title || ''} ${content || ''}`.toLowerCase();
  
  const highImpactTerms = ['urgent', 'critical', 'mandatory', 'regulation', 'law', 'compliance', 'deadline', 'penalty', 'fine'];
  const mediumImpactTerms = ['important', 'update', 'change', 'new standard', 'requirement'];
  
  let highMatches = 0;
  let mediumMatches = 0;
  
  highImpactTerms.forEach(term => {
    if (text.includes(term)) highMatches++;
  });
  
  mediumImpactTerms.forEach(term => {
    if (text.includes(term)) mediumMatches++;
  });
  
  if (highMatches >= 2) return 'high';
  if (highMatches >= 1 || mediumMatches >= 2) return 'medium';
  return 'low';
}

// Calculate relevance score based on ESG keywords
export function calculateRelevanceScore(title?: string, content?: string): number {
  const text = `${title || ''} ${content || ''}`.toLowerCase();
  
  const esgKeywords = [
    'esg', 'sustainability', 'sustainable', 'environment', 'environmental', 
    'social', 'governance', 'carbon', 'emission', 'climate', 'green', 
    'renewable', 'reporting', 'disclosure', 'compliance', 'regulation',
    'framework', 'standard', 'guideline', 'metric', 'target', 'goal',
    'sdg', 'net zero', 'ghg', 'greenhouse', 'biodiversity'
  ];
  
  let matches = 0;
  esgKeywords.forEach(keyword => {
    if (text.includes(keyword)) matches++;
  });
  
  // Calculate score from 0 to 1
  return Math.min(1, matches / 8); // max out at 8 matches
}

// Extract tags from content
export function extractTags(title?: string, content?: string, category?: string): string[] {
  const text = `${title || ''} ${content || ''}`.toLowerCase();
  const tags = [];
  
  // Add category as a tag
  if (category) tags.push(category);
  
  // Check for ESG pillar tags
  if (text.match(/environment|climate|emission|carbon|pollution|energy|water|waste/)) {
    tags.push('environmental');
  }
  
  if (text.match(/social|community|employee|diversity|inclusion|human right|labor/)) {
    tags.push('social');
  }
  
  if (text.match(/governance|board|executive|compliance|ethics|transparency|anti-corruption/)) {
    tags.push('governance');
  }
  
  // Check for regulation/reporting tags
  if (text.match(/regulation|law|directive|act|policy/)) {
    tags.push('regulation');
  }
  
  if (text.match(/reporting|disclosure|standard|framework|guideline/)) {
    tags.push('reporting');
  }
  
  return [...new Set(tags)]; // Remove duplicates
}

// Extract country references
export function extractCountry(title?: string, content?: string): string | null {
  const text = `${title || ''} ${content || ''}`;
  
  const countries = ['EU', 'Europe', 'European Union', 'US', 'USA', 'United States', 
                     'UK', 'United Kingdom', 'China', 'Japan', 'Canada', 'Australia', 
                     'India', 'Brazil', 'Germany', 'France', 'Italy', 'Spain'];
  
  for (const country of countries) {
    const regex = new RegExp(`\\b${country}\\b`, 'i');
    if (text.match(regex)) {
      return country;
    }
  }
  
  return null;
}
