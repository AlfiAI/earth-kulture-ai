
import { RefObject, useEffect } from 'react';

interface WalyChatOutsideClickHandlerProps {
  isOpen: boolean;
  onClose: () => void;
  chatRef: RefObject<HTMLDivElement>;
}

const WalyChatOutsideClickHandler = ({ 
  isOpen,
  onClose,
  chatRef 
}: WalyChatOutsideClickHandlerProps) => {
  // Handle clicks outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatRef.current && 
        !chatRef.current.contains(event.target as Node) &&
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
  }, [isOpen, onClose, chatRef]);

  return null; // This is a behavior-only component with no UI
};

export default WalyChatOutsideClickHandler;
