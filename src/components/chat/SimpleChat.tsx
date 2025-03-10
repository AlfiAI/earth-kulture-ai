
import { useState, useEffect, useRef } from 'react';
import SimpleChatButton from './SimpleChatButton';
import SimpleChatPanel from './SimpleChatPanel';
import { MessageProps } from './SimpleMessage';
import { toast } from "sonner";

// Simple mock AI service with improved reliability
const generateAIResponse = async (message: string): Promise<string> => {
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
};

const SimpleChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [position] = useState({ bottom: 2, right: 2 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    console.log('SimpleChat mounted, initializing chat');
    
    // Add welcome message when component mounts
    setMessages([{
      id: '1',
      content: "Hello! I'm your sustainability assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }]);
    
    // Mark this component in the DOM for visibility debugging
    const chatElement = document.createElement('div');
    chatElement.id = 'simple-chat-marker';
    chatElement.style.display = 'none';
    document.body.appendChild(chatElement);
    
    return () => {
      if (document.getElementById('simple-chat-marker')) {
        document.body.removeChild(document.getElementById('simple-chat-marker')!);
      }
    };
  }, []);
  
  const toggleChat = () => {
    console.log('Toggling chat from', isOpen, 'to', !isOpen);
    setIsOpen(!isOpen);
    
    // If opening the chat, scroll to bottom after a short delay
    if (!isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };
  
  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    
    console.log('Sending message:', messageText);
    
    // Add user message
    const userMessage: MessageProps = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Generate and add AI response
    try {
      // Scroll to bottom immediately after user message appears
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
      const aiResponse = await generateAIResponse(messageText);
      
      const aiMessage: MessageProps = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      
      // Scroll to bottom again after AI response appears
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      setIsTyping(false);
      
      // Show error toast
      toast.error("Sorry, I couldn't process your request right now.");
      
      // Add error message
      const errorMessage: MessageProps = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again later.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };
  
  return (
    <>
      <SimpleChatButton onClick={toggleChat} position={position} />
      
      <SimpleChatPanel 
        isOpen={isOpen} 
        onClose={toggleChat} 
        messages={messages}
        onSendMessage={handleSendMessage}
        isTyping={isTyping}
        messagesEndRef={messagesEndRef}
      />
    </>
  );
};

export default SimpleChat;
