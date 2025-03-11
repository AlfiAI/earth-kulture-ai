
/**
 * LocalAIProcessor - Handles local AI model processing
 */

export class LocalAIProcessor {
  private localAIAvailable: boolean | null = null;
  private lastLocalAICheck: number = 0;
  private readonly LOCAL_API_URL = "http://localhost:11434/api/chat";
  private readonly LOCAL_MODEL_NAME = "llama3";

  /**
   * Process query with local AI model
   */
  async processWithLocalAI(query: string, formattedMessages: any[], systemPrompt: string): Promise<string> {
    // Check if local AI is available
    if (!(await this.checkLocalAIAvailability())) {
      throw new Error("Local AI is not available");
    }
    
    // Add system prompt and user query
    const messages = [
      { role: "system", content: systemPrompt },
      ...formattedMessages,
      { role: "user", content: query }
    ];
    
    console.log("Processing with local AI model", this.LOCAL_MODEL_NAME);
    
    const response = await fetch(this.LOCAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.LOCAL_MODEL_NAME,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Local AI Error: ${errorText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  }
  
  /**
   * Check if local AI is available
   */
  async checkLocalAIAvailability(): Promise<boolean> {
    // Cache the check for 5 minutes
    const now = Date.now();
    if (this.localAIAvailable !== null && (now - this.lastLocalAICheck) < 5 * 60 * 1000) {
      return this.localAIAvailable;
    }
    
    try {
      const response = await fetch(this.LOCAL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.LOCAL_MODEL_NAME,
          messages: [{ role: "user", content: "hello" }],
          max_tokens: 1
        }),
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      
      this.localAIAvailable = response.ok;
      this.lastLocalAICheck = now;
      return this.localAIAvailable;
    } catch (error) {
      console.error("Error checking local AI availability:", error);
      this.localAIAvailable = false;
      this.lastLocalAICheck = now;
      return false;
    }
  }
  
  /**
   * Determine if we should use local AI based on query complexity
   */
  shouldUseLocalAI(query: string, apiFailureCount: number, apiFailureThreshold: number): boolean {
    // Simple complexity check - can be made more sophisticated
    const isSimpleQuery = query.length < 100 && !query.includes("complex") && 
                         !query.includes("analyze") && !query.includes("compare");
    
    return isSimpleQuery && apiFailureCount < apiFailureThreshold;
  }
}

export const localAIProcessor = new LocalAIProcessor();
