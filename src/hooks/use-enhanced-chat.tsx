
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { MessageProps } from '@/components/ai/Message';
import { deepseekR1Service } from '@/services/ai/deepseekR1Service';
import { enhancedAIContext, ENHANCED_SYSTEM_PROMPT } from '@/components/ai/constants/enhancedAIContext';
import { walyAIService } from '@/services/ai/walyAIService';
import { useConversationContext } from './chat/use-conversation-context';
import { useIntentAnalyzer } from './chat/use-intent-analyzer';
import { useActionExecutor } from './chat/use-action-executor';

export const useEnhancedChat = (initialMessages: MessageProps[] = []) => {
  const [messages, setMessages] = useState<MessageProps[]>(
    initialMessages.length > 0 
      ? initialMessages 
      : [walyAIService.getEnhancedWelcomeMessage()]
  );
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const { conversationContext, updateConversationContext } = useConversationContext();
  const { analyzeUserIntent, categorizeIntent } = useIntentAnalyzer();
  const { executeUserIntent, checkForNavigationCommand } = useActionExecutor();
  
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

  // Check for navigation commands in AI responses
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'ai') {
        checkForNavigationCommand(lastMessage.content);
      }
    }
  }, [messages, checkForNavigationCommand]);

  const handleSend = async () => {
    if (inputValue.trim() === '') return;
    
    const userMessage: MessageProps = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    // Analyze user intent from the message
    const userIntent = analyzeUserIntent(inputValue, conversationContext.pageContext);
    
    // Update conversation context based on user message
    updateConversationContext(inputValue);
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      // Create a customized system prompt incorporating conversation context and page context
      const customizedPrompt = `${ENHANCED_SYSTEM_PROMPT}
      
Current conversation context:
- Page: ${conversationContext.pageContext.path || 'Unknown'}
- Page type: ${conversationContext.pageContext.pageType || 'General'}
- Recent topics: ${conversationContext.recentTopics.join(', ')}
- User preferences: ${Object.keys(conversationContext.userPreferences).join(', ')}

You have the ability to help users navigate through the application by including [NAVIGATE:route-name] in your responses when appropriate.
For example: "Let me show you the dashboard [NAVIGATE:dashboard]" or "I'll take you to the analytics page [NAVIGATE:analytics]"

Only use this when the user specifically asks to be taken to a different page, not for every response.
Available routes: dashboard, analytics, compliance, benchmark, data, reports, goals, settings, insights, auth, signup, about
`;
      
      // Process the user query with DeepSeek R1 service
      let aiResponse = await deepseekR1Service.processQuery(
        userMessage.content,
        messages.filter(msg => msg.id !== '1'),
        customizedPrompt
      );
      
      // If navigation intent was detected, add the navigation command to the response
      if (userIntent.navigateTo && !aiResponse.includes('[NAVIGATE:')) {
        const routeName = userIntent.navigateTo.replace('/', '');
        aiResponse += ` [NAVIGATE:${routeName || 'dashboard'}]`;
      }
      
      const aiMessage: MessageProps = {
        id: Date.now().toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Execute the user intent after the AI has responded
      await executeUserIntent(userIntent);
      
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
