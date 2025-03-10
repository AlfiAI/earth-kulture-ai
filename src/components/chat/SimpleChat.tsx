
import { useState, useEffect } from 'react';
import SimpleChatButton from './SimpleChatButton';
import SimpleChatPanel from './SimpleChatPanel';
import { MessageProps } from './SimpleMessage';

// Simple mock AI service
const generateAIResponse = async (message: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
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
  
  // Default response
  return "I'm here to help with your sustainability and ESG needs. Feel free to ask me about carbon tracking, ESG reporting, or sustainability best practices!";
};

const SimpleChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [position] = useState({ bottom: 2, right: 2 });
  
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
  };
  
  const handleSendMessage = async (messageText: string) => {
    console.log('Sending message:', messageText);
    
    // Add user message
    const userMessage: MessageProps = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Generate and add AI response
    try {
      const aiResponse = await generateAIResponse(messageText);
      
      const aiMessage: MessageProps = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
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
      />
    </>
  );
};

export default SimpleChat;
