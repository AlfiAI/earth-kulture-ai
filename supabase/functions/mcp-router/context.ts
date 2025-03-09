
import { MAX_CONTEXT_MESSAGES, CONTEXT_EXPIRATION_MS } from './config.ts';

// In-memory context cache (in production, this would be Redis/database backed)
const sessionContextCache = new Map();

// Extract topics or key entities from a prompt
export function extractTopics(prompt: string): string[] {
  // Simple topic extraction logic
  // In production, this would use more sophisticated NLP techniques
  
  const words = prompt.toLowerCase().split(/\s+/);
  const stopWords = new Set(["the", "and", "or", "a", "an", "in", "on", "at", "by", "for", "with", "about", "to", "of"]);
  
  return words
    .filter(word => word.length > 4 && !stopWords.has(word))
    .slice(0, 3);
}

// Get user session context, create if it doesn't exist
export function getOrCreateSessionContext(sessionId: string, userId: string): any {
  // Clean expired sessions first
  cleanExpiredSessions();
  
  // Check if session exists
  if (sessionContextCache.has(sessionId)) {
    const context = sessionContextCache.get(sessionId);
    // Update last accessed time
    context.lastAccessed = Date.now();
    return context;
  }
  
  // Create new session context
  const newContext = {
    sessionId,
    userId,
    messages: [],
    topics: [],
    lastAccessed: Date.now(),
    created: Date.now()
  };
  
  sessionContextCache.set(sessionId, newContext);
  return newContext;
}

// Clean expired sessions from memory
export function cleanExpiredSessions(): void {
  const now = Date.now();
  
  for (const [sessionId, context] of sessionContextCache.entries()) {
    if (now - context.lastAccessed > CONTEXT_EXPIRATION_MS) {
      sessionContextCache.delete(sessionId);
    }
  }
}

// Summarize conversation context for inclusion in prompts
export function summarizeContext(context: any): string {
  if (!context || context.messages.length === 0) {
    return "";
  }
  
  const recentMessages = context.messages.slice(-MAX_CONTEXT_MESSAGES);
  let summary = "Previous conversation context:\n";
  
  recentMessages.forEach((msg: any, index: number) => {
    summary += `${index + 1}. ${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}\n`;
  });
  
  if (context.topics.length > 0) {
    summary += `\nRelevant topics: ${context.topics.join(', ')}`;
  }
  
  return summary;
}

// Update session context with new message
export function updateSessionContext(context: any, role: string, content: string): void {
  // Add message to context
  context.messages.push({
    role,
    content,
    timestamp: Date.now()
  });
  
  // Limit context size to prevent excessive memory usage
  if (context.messages.length > MAX_CONTEXT_MESSAGES * 2) {
    context.messages = context.messages.slice(-MAX_CONTEXT_MESSAGES);
  }
  
  // If user message, extract and update topics
  if (role === 'user') {
    const newTopics = extractTopics(content);
    
    // Add new topics to existing ones, avoiding duplicates
    newTopics.forEach(topic => {
      if (!context.topics.includes(topic)) {
        context.topics.push(topic);
      }
    });
    
    // Limit topics to most recent/relevant
    if (context.topics.length > 10) {
      context.topics = context.topics.slice(-10);
    }
  }
  
  // Update last accessed time
  context.lastAccessed = Date.now();
}
