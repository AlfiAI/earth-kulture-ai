
import { RESTRICTED_WORDS } from './config.ts';

// Validate prompt for problematic content
export function validatePrompt(prompt: string): { valid: boolean; reason?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { valid: false, reason: "Empty prompt" };
  }
  
  // Check for restricted words (basic implementation)
  const lowerPrompt = prompt.toLowerCase();
  for (const word of RESTRICTED_WORDS) {
    if (lowerPrompt.includes(word)) {
      return { 
        valid: false, 
        reason: `Prompt contains restricted content: ${word}` 
      };
    }
  }
  
  return { valid: true };
}

// Function to calculate prompt complexity
export function calculateComplexity(prompt: string): number {
  // This is a simplified complexity calculation
  // In production, this could use more sophisticated NLP metrics
  
  // Factors that might indicate complexity:
  // 1. Sentence length and variation
  // 2. Vocabulary diversity
  // 3. Use of technical terms
  // 4. Question complexity
  
  const words = prompt.split(/\s+/);
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  
  // Ratio of unique words to total words indicates vocabulary diversity
  const lexicalDiversity = uniqueWords.size / words.length;
  
  // Average word length as a rough proxy for complexity
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  
  // Normalize to 0-1 scale
  const lengthFactor = Math.min(1, prompt.length / 500);
  const wordLengthFactor = Math.min(1, avgWordLength / 8);
  
  // Combined complexity score
  return (lexicalDiversity * 0.4) + (wordLengthFactor * 0.3) + (lengthFactor * 0.3);
}
