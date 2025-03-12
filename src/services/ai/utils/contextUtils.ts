
/**
 * Utility functions to manage context for AI conversations
 */

interface PageContext {
  type: string;
  data: any;
  relevantTopics: string[];
}

/**
 * Get relevant context based on the current page
 */
export function getContextForCurrentPage(path?: string): string {
  const currentPath = path || window.location.pathname;
  
  if (currentPath.includes('dashboard')) {
    return 'Dashboard context: ESG metrics, carbon footprint, compliance status';
  } else if (currentPath.includes('analytics')) {
    return 'Analytics context: Trends, reports, data analysis, metrics';
  } else if (currentPath.includes('compliance')) {
    return 'Compliance context: Regulatory frameworks, reporting requirements';
  } else if (currentPath.includes('benchmarking')) {
    return 'Benchmarking context: Industry comparisons, performance indicators';
  } else {
    return 'General ESG and sustainability context';
  }
}

/**
 * Extract relevant keywords from a user query
 */
export function extractKeywords(query: string): string[] {
  // Simple implementation - split by spaces and filter out common words
  const commonWords = ['the', 'and', 'or', 'a', 'an', 'to', 'in', 'for', 'how', 'what', 'is'];
  
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.includes(word));
}

/**
 * Determine if a user query is related to a specific topic
 */
export function isQueryRelatedTo(query: string, topic: string): boolean {
  const keywords = extractKeywords(query);
  const topicKeywords = extractKeywords(topic);
  
  return keywords.some(keyword => topicKeywords.includes(keyword));
}
