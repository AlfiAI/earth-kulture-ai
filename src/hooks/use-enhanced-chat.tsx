import { useState, useEffect, useCallback } from 'react';
import { deepseekR1Service } from '@/services/ai/deepseekR1Service';
import { getContextForCurrentPage } from '@/services/ai/utils/contextUtils';

interface Message {
  text: string;
  isUser: boolean;
}

export const useEnhancedChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to add a new message to the chat
  const addMessage = useCallback((text: string, isUser: boolean) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser }]);
  }, []);

  // Function to handle sending a message
  const sendMessage = async (message: string) => {
    setIsLoading(true);
    setError(null);
    addMessage(message, true); // Add user message immediately
    setInput(''); // Clear input field

    try {
      // Get relevant context
      const context = getContextForCurrentPage();
      
      // Process query with the DeepSeek R1 service
      const response = await deepseekR1Service.processQuery(
        message,
        [...messages]  // Pass conversation history
      );

      addMessage(response, false); // Add AI response
    } catch (error: any) {
      console.error("Error in enhanced chat:", error);
      setError(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input.trim());
    }
  };

  return {
    messages,
    input,
    isLoading,
    error,
    handleInputChange,
    handleSubmit,
  };
};
