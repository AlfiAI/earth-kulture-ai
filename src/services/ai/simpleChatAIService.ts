
// A simplified service for handling AI message generation
export const simpleChatAIService = {
  // Generate an AI response based on user input
  generateResponse: async (message: string): Promise<string> => {
    console.log('Generating AI response for:', message);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // Simple responses based on keywords
      if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
        return "Hello! How can I help you with your ESG goals today?";
      }
      
      if (message.toLowerCase().includes('esg')) {
        return "ESG (Environmental, Social, and Governance) refers to the three central factors in measuring sustainability and ethical impact of an investment in a business. Would you like to know more about a specific aspect?";
      }
      
      if (message.toLowerCase().includes('carbon')) {
        return "Carbon footprint reduction is a key part of environmental sustainability. Our platform can help you track and reduce your carbon emissions through data-driven insights and actionable recommendations.";
      }
      
      if (message.toLowerCase().includes('sustainability')) {
        return "Sustainability is about meeting our present needs without compromising the ability of future generations to meet their own needs. Our platform provides tools and insights to help you improve your organization's sustainability practices.";
      }
      
      // Default response
      return "I'm here to help with your sustainability and ESG needs. Feel free to ask me about carbon tracking, ESG reporting, or sustainability best practices!";
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to generate response');
    }
  },
  
  // Create a welcome message
  getWelcomeMessage: () => {
    return {
      id: '1',
      content: "Hello! I'm your sustainability assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    };
  }
};
