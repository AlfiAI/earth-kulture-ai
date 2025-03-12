
import { useState, useEffect, useCallback } from 'react';
import { deepseekR1Service } from '@/services/ai/deepseekR1Service';
// Remove the non-existent module import and create a simple context utility
import { MessageProps } from '@/components/ai/Message';

// Get context based on current page (placeholder function)
const getContextForCurrentPage = () => {
  return 'general context';
};

interface Message {
  text: string;
  isUser: boolean;
}

export const useEnhancedChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false); // Add isTyping state

  // Function to add a new message to the chat
  const addMessage = useCallback((text: string, isUser: boolean) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser }]);
  }, []);

  // Function to handle sending a message
  const sendMessage = async (message: string) => {
    setIsLoading(true);
    setIsTyping(true); // Set typing indicator
    setError(null);
    addMessage(message, true); // Add user message immediately
    setInput(''); // Clear input field

    try {
      // Get relevant context
      const context = getContextForCurrentPage();
      
      // Process query with the DeepSeek R1 service
      const response = await deepseekR1Service.processQuery(
        message,
        [] // Pass conversation history
      );

      addMessage(response, false); // Add AI response
    } catch (error: any) {
      console.error("Error in enhanced chat:", error);
      setError(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
      setIsTyping(false); // Clear typing indicator
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

  // Helper function to match the interface needed by components
  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
    }
  };

  // Map input to inputValue for component compatibility
  const inputValue = input;
  const setInputValue = setInput;

  return {
    messages,
    input,
    inputValue,
    setInputValue,
    isLoading,
    isTyping,
    error,
    handleInputChange,
    handleSubmit,
    handleSend,
  };
};
