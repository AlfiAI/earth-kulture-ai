
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import EnhancedChatPanel from './EnhancedChatPanel';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatPosition } from '@/hooks/use-chat-position';
import WalyChatButton from './WalyChatButton';
import { useEnhancedChat } from '@/hooks/use-enhanced-chat';
import { useLocation, useNavigate } from 'react-router-dom';

interface EnhancedWalyAssistantProps {
  initialOpen?: boolean;
}

const EnhancedWalyAssistant = ({ initialOpen = false }: EnhancedWalyAssistantProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [showNewChat, setShowNewChat] = useState(true);
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const position = useChatPosition();
  const { inputValue, setInputValue, handleSend, messages } = useEnhancedChat();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // When messages change, check for navigation commands
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'ai') {
        checkForNavigationCommand(lastMessage.content);
      }
    }
  }, [messages, navigate]);

  // Force visibility check on route change
  useEffect(() => {
    // Ensure Waly is visible on all routes
    console.log("Route changed, Waly should be visible:", location.pathname);
  }, [location.pathname]);

  const checkForNavigationCommand = (content: string) => {
    // Check for navigation commands in AI responses
    if (content.includes("[NAVIGATE:")) {
      const match = content.match(/\[NAVIGATE:(.*?)\]/);
      if (match && match[1]) {
        const destination = match[1].trim();
        // Navigate to the specified route
        setTimeout(() => {
          navigate(`/${destination}`);
        }, 1000);
      }
    }
  };
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  
  const handleStarterClick = (text: string) => {
    setInputValue(text);
    // Open the chat when starter is clicked
    setIsOpen(true);
    // Automatically send the message after a small delay
    setTimeout(() => {
      handleSend();
      setShowNewChat(false);
    }, 100);
  };

  // Context-aware starter suggestions based on current route
  const getContextAwareStarters = () => {
    const currentPath = location.pathname;
    
    if (currentPath.includes('analytics')) {
      return [
        "Explain this chart data",
        "How can I improve my ESG score?",
        "What trends do you see in my emissions?",
        "Recommend KPIs for my dashboard"
      ];
    } else if (currentPath.includes('benchmark')) {
      return [
        "How do I compare to industry peers?",
        "What's a good carbon intensity target?",
        "Explain my competitive position",
        "Suggest benchmarking improvements"
      ];
    } else if (currentPath.includes('compliance')) {
      return [
        "Explain CSRD requirements",
        "Am I at risk of non-compliance?",
        "Summarize upcoming regulations",
        "How to prepare for SEC climate rules"
      ];
    } else if (currentPath.includes('about')) {
      return [
        "What makes your platform unique?",
        "How do you handle data security?",
        "Tell me about your ESG expertise",
        "What industry standards do you support?"
      ];
    } else {
      // Default starters
      return [
        "How can I improve my ESG score?",
        "Explain carbon footprint tracking",
        "What ESG metrics should I monitor?",
        "How to start sustainability reporting?"
      ];
    }
  };

  // Detect clicks outside the chat panel to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatPanelRef.current && 
        !chatPanelRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('#chat-button') && // Use ID selector to match WalyChatButton
        !(event.target as HTMLElement).closest('button')
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {!isOpen && (
        <WalyChatButton 
          onClick={toggleOpen} 
          position={position}
          onStarterClick={handleStarterClick}
          contextAwareStarters={getContextAwareStarters()}
        />
      )}
      
      <EnhancedChatPanel 
        ref={chatPanelRef}
        isOpen={isOpen}
        onClose={toggleOpen}
        position={position}
        currentPath={location.pathname}
      />
    </>
  );
};

export default EnhancedWalyAssistant;
