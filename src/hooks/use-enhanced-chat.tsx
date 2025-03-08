
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { MessageProps } from '@/components/ai/Message';
import { deepseekR1Service } from '@/services/ai/deepseekR1Service';
import { enhancedAIContext, ENHANCED_SYSTEM_PROMPT } from '@/components/ai/constants/enhancedAIContext';
import { walyAIService } from '@/services/ai/walyAIService';

export const useEnhancedChat = (initialMessages: MessageProps[] = []) => {
  const [messages, setMessages] = useState<MessageProps[]>(
    initialMessages.length > 0 
      ? initialMessages 
      : [walyAIService.getEnhancedWelcomeMessage()]
  );
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState({
    recentTopics: [] as string[],
    userPreferences: {} as Record<string, any>,
  });
  
  // Simulate proactive AI behavior
  useEffect(() => {
    if (enhancedAIContext.assistantMode === 'proactive') {
      const proactiveInterval = setTimeout(() => {
        if (messages.length === 1) {
          const proactiveMessage: MessageProps = {
            id: Date.now().toString(),
            content: "I've noticed you're in the top quartile for environmental performance, but I've identified opportunities to improve your social score based on industry benchmarks. Would you like to see my recommendations?",
            sender: 'ai',
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, proactiveMessage]);
        }
      }, 15000); // Show proactive message after 15 seconds
      
      return () => clearTimeout(proactiveInterval);
    }
  }, [messages.length]);

  // Update conversation context for better contextual understanding
  const updateConversationContext = (query: string) => {
    // Determine the intent of the query
    const intent = deepseekR1Service.categorizeIntent(query);
    
    // Update recent topics (max 5)
    setConversationContext(prev => {
      const updatedTopics = [intent, ...prev.recentTopics.slice(0, 4)];
      
      // Extract preferences (simple implementation)
      const updatedPreferences = { ...prev.userPreferences };
      if (query.toLowerCase().includes('prefer') || query.toLowerCase().includes('like')) {
        const preference = query.split(' ').slice(-1)[0].toLowerCase();
        updatedPreferences[preference] = true;
      }
      
      return {
        recentTopics: updatedTopics,
        userPreferences: updatedPreferences
      };
    });
  };

  const handleSend = async () => {
    if (inputValue.trim() === '') return;
    
    const userMessage: MessageProps = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    // Update conversation context based on user message
    updateConversationContext(inputValue);
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      // Create a customized system prompt incorporating conversation context
      const customizedPrompt = `${ENHANCED_SYSTEM_PROMPT}
      
Current conversation context:
- Recent topics: ${conversationContext.recentTopics.join(', ')}
- User preferences: ${Object.keys(conversationContext.userPreferences).join(', ')}`;
      
      // Process the user query with DeepSeek R1 service
      const aiResponse = await deepseekR1Service.processQuery(
        userMessage.content, 
        messages.filter(msg => msg.id !== '1'), 
        customizedPrompt
      );
      
      const aiMessage: MessageProps = {
        id: Date.now().toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error processing query:', error);
      toast.error('Sorry, I encountered an error processing your request.');
      
      const errorMessage: MessageProps = {
        id: Date.now().toString(),
        content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    handleSend,
    conversationContext
  };
};
