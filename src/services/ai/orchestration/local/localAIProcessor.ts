import { LocalAIConfig } from '../types/agentTypes';

/**
 * Class for handling local AI processing functionality
 */
export class LocalAIProcessor {
  private config: LocalAIConfig;
  
  constructor(config: LocalAIConfig) {
    this.config = config;
  }
  
  /**
   * Check if local AI is available
   */
  async isAvailable(): Promise<boolean> {
    const now = new Date();
    const fiveMinutesInMs = 5 * 60 * 1000;
    
    if (this.config.available !== null && 
        this.config.lastCheck && 
        (now.getTime() - this.config.lastCheck.getTime()) < fiveMinutesInMs) {
      return this.config.available;
    }
    
    try {
      const response = await fetch(this.config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.modelName,
          messages: [{ role: "user", content: "hello" }],
          max_tokens: 1
        }),
        signal: AbortSignal.timeout(3000)
      });
      
      this.config.available = response.ok;
      this.config.lastCheck = new Date();
      return this.config.available;
    } catch (error) {
      console.error("Error checking local AI availability:", error);
      this.config.available = false;
      this.config.lastCheck = new Date();
      return false;
    }
  }
  
  /**
   * Process a query using the local AI model
   */
  async processQuery(
    systemPrompt: string, 
    userPrompt: string, 
    temperature: number = 0.5, 
    maxTokens: number = 800
  ): Promise<string> {
    try {
      const response = await fetch(this.config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.modelName,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature,
          max_tokens: maxTokens
        })
      });
      
      if (!response.ok) {
        throw new Error(`Local AI responded with status ${response.status}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error in local AI processing:', error);
      throw error;
    }
  }
  
  /**
   * Update the local AI configuration
   */
  updateConfig(config: Partial<LocalAIConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  /**
   * Get the current local AI configuration
   */
  getConfig(): LocalAIConfig {
    return { ...this.config };
  }
}
