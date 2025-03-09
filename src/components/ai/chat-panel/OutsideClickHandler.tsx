
import { RefObject, useEffect } from 'react';

interface OutsideClickHandlerProps {
  isOpen: boolean;
  onClose: () => void;
  chatPanelRef: RefObject<HTMLDivElement>;
}

const OutsideClickHandler = ({ isOpen, onClose, chatPanelRef }: OutsideClickHandlerProps) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatPanelRef.current && 
        !chatPanelRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('#chat-button') && // Use ID selector to match WalyChatButton
        !(event.target as HTMLElement).closest('button')
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, chatPanelRef]);

  return null; // This is a behavior-only component with no UI
};

export default OutsideClickHandler;
