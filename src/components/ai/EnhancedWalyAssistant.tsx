
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import EnhancedChatPanel from './EnhancedChatPanel';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatPosition } from '@/hooks/use-chat-position';
import WalyChatButton from './WalyChatButton';
import { useEnhancedChat } from '@/hooks/use-enhanced-chat';

interface EnhancedWalyAssistantProps {
  initialOpen?: boolean;
}

const EnhancedWalyAssistant = ({ initialOpen = false }: EnhancedWalyAssistantProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [showNewChat, setShowNewChat] = useState(true);
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const position = useChatPosition();
  const { inputValue, setInputValue, handleSend } = useEnhancedChat();
  
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

  // Detect clicks outside the chat panel to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatPanelRef.current && 
        !chatPanelRef.current.contains(event.target as Node) &&
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
        />
      )}
      
      <EnhancedChatPanel 
        ref={chatPanelRef}
        isOpen={isOpen}
        onClose={toggleOpen}
        position={position}
      />
    </>
  );
};

export default EnhancedWalyAssistant;
