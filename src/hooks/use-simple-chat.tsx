
import { useState, useEffect } from 'react';
import { MessageProps } from '@/components/chat/SimpleMessage';
import { simpleChatAIService } from '@/services/ai/simpleChatAIService';
import { toast } from "sonner";

export const useSimpleChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Initialize with welcome message
  useEffect(() => {
    console.log('SimpleChat hook initialized');
    setMessages([simpleChatAIService.getWelcomeMessage()]);
  }, []);
  
  const toggleChat = () => {
    console.log('Toggling chat from', isOpen, 'to', !isOpen);
    setIsOpen(!isOpen);
  };
  
  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    
    console.log('Sending message:', messageText);
    
    // Add user message
    const userMessage: MessageProps = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'user', // Explicitly using the literal type 'user'
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Generate and add AI response
    try {
      const aiResponse = await simpleChatAIService.generateResponse(messageText);
      
      const aiMessage: MessageProps = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai', // Explicitly using the literal type 'ai'
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Show error toast
      toast.error("Sorry, I couldn't process your request right now.");
      
      // Add error message
      const errorMessage: MessageProps = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again later.",
        sender: 'ai', // Explicitly using the literal type 'ai'
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return {
    isOpen,
    toggleChat,
    messages,
    isTyping,
    handleSendMessage
  };
};
