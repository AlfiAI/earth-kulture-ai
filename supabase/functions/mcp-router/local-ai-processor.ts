
import { HYBRID_AI_CONFIG } from './config.ts';

// Interface for local AI request
interface LocalAIRequest {
  model: string;
  messages: {
    role: string;
    content: string;
  }[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

// Interface for local AI response
interface LocalAIResponse {
  id: string;
  model: string;
  created: number;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
}

/**
 * Process a query using a local AI model (e.g., Ollama)
 */
export async function processLocalAI(
  prompt: string,
  systemPrompt: string = "You are a helpful assistant specialized in ESG and sustainability topics."
): Promise<{ text: string; error?: string }> {
  try {
    console.log("Processing query with local AI model:", HYBRID_AI_CONFIG.LOCAL_MODEL_NAME);
    
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ];
    
    const requestBody: LocalAIRequest = {
      model: HYBRID_AI_CONFIG.LOCAL_MODEL_NAME,
      messages: messages,
      stream: false,
      temperature: 0.7,
      max_tokens: HYBRID_AI_CONFIG.MAX_LOCAL_TOKENS
    };
    
    const response = await fetch(HYBRID_AI_CONFIG.LOCAL_MODEL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Local AI model error:", errorText);
      throw new Error(`Local AI model responded with status ${response.status}: ${errorText}`);
    }
    
    const data: LocalAIResponse = await response.json();
    return { text: data.choices[0].message.content };
  } catch (error) {
    console.error("Error processing with local AI:", error);
    return { 
      text: "I'm sorry, I couldn't process your request with the local AI model.", 
      error: error.message 
    };
  }
}

/**
 * Check if local AI is available by sending a simple ping
 */
export async function isLocalAIAvailable(): Promise<boolean> {
  try {
    const pingResponse = await fetch(HYBRID_AI_CONFIG.LOCAL_MODEL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: HYBRID_AI_CONFIG.LOCAL_MODEL_NAME,
        messages: [{ role: "user", content: "hello" }],
        max_tokens: 1
      })
    });
    
    return pingResponse.ok;
  } catch (error) {
    console.error("Local AI not available:", error);
    return false;
  }
}
