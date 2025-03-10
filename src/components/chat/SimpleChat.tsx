
import { useRef } from 'react';
import SimpleChatButton from './SimpleChatButton';
import SimpleChatPanel from './SimpleChatPanel';
import { useSimpleChat } from '@/hooks/use-simple-chat';

const SimpleChat = () => {
  const { isOpen, toggleChat, messages, isTyping, handleSendMessage } = useSimpleChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fixed position for the chat button
  const position = { bottom: 2, right: 2 };
  
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
