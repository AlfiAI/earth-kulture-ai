
import { RefObject, useEffect } from 'react';

interface OutsideClickHandlerProps {
  isOpen: boolean;
  onClose: () => void;
  chatPanelRef: RefObject<HTMLDivElement>;
  excludeSelectors?: string[];
}

/**
 * Handles clicks outside the AI chat panel to close it
 */
const OutsideClickHandler = ({ 
  isOpen, 
  onClose, 
  chatPanelRef,
  excludeSelectors = ['#chat-button', 'button.ai-starter']
}: OutsideClickHandlerProps) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if clicking inside the chat panel
      if (chatPanelRef.current && chatPanelRef.current.contains(event.target as Node)) {
        return;
      }
      
      // Don't close if clicking on excluded elements
      const isExcluded = excludeSelectors.some(selector => 
        (event.target as HTMLElement).closest(selector) !== null
      );
      
      if (!isExcluded) {
        onClose();
      }
    };

    if (isOpen) {
      // Use capture phase to ensure we handle the event before other listeners
      document.addEventListener('mousedown', handleClickOutside, true);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isOpen, onClose, chatPanelRef, excludeSelectors]);

  // Listen for escape key to close the panel
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  return null; // This is a behavior-only component with no UI
};

export default OutsideClickHandler;
