
import { useState, useEffect } from 'react';
import EnhancedChatToggleButton from './EnhancedChatToggleButton';
import EnhancedChatPanel from './EnhancedChatPanel';

interface EnhancedWalyAssistantProps {
  initialOpen?: boolean;
}

const EnhancedWalyAssistant = ({ initialOpen = false }: EnhancedWalyAssistantProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // Focus the input field when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const inputElement = document.querySelector('.chat-input textarea');
        if (inputElement instanceof HTMLTextAreaElement) {
          inputElement.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  return (
    <>
      {!isOpen && <EnhancedChatToggleButton onClick={toggleOpen} />}
      <EnhancedChatPanel isOpen={isOpen} onClose={toggleOpen} />
    </>
  );
};

export default EnhancedWalyAssistant;
