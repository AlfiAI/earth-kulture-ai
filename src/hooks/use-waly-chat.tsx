
import { useState } from 'react';
import { toast } from "sonner";
import { MessageProps } from '@/components/ai/Message';
import { walyAIService } from '@/services/ai/walyAIService';

export const useWalyChat = (initialMessages: MessageProps[] = []) => {
  const [messages, setMessages] = useState<MessageProps[]>(
    initialMessages.length > 0 
      ? initialMessages 
      : [walyAIService.getWelcomeMessage()]
  );
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (inputValue.trim() === '') return;
    
    const userMessage = walyAIService.createUserMessage(inputValue);
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      // Process the user query with AI
      const aiResponse = await walyAIService.processQuery(userMessage.content);
      
      const aiMessage = walyAIService.createAIMessage(aiResponse);
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error processing query:', error);
      toast.error('Sorry, I encountered an error processing your request.');
      
      const errorMessage = walyAIService.createAIMessage(
        "I'm sorry, I encountered an error while processing your request. Please try again later."
      );
      
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
  };
};
