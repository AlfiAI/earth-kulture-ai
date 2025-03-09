
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavigationListenerProps {
  messages: Array<{
    sender: string;
    content: string;
  }>;
}

const NavigationListener = ({ messages }: NavigationListenerProps) => {
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

  return null; // This is a behavior-only component with no UI
};

export default NavigationListener;
