
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageProps } from '../Message';
import { toast } from 'sonner';

interface NavigationListenerProps {
  messages: Array<{
    sender: string;
    content: string;
  }>;
}

/**
 * Listens for navigation commands in AI messages and handles ESG-specific routing
 */
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
    // Check for general navigation commands
    if (content.includes("[NAVIGATE:")) {
      const match = content.match(/\[NAVIGATE:(.*?)\]/);
      if (match && match[1]) {
        const destination = match[1].trim();
        // Navigate to the specified route
        setTimeout(() => {
          navigate(`/${destination}`);
          toast.info(`Navigating to ${destination}`);
        }, 1000);
      }
    }
    
    // Check for ESG-specific navigation commands
    if (content.includes("[ESG_REPORT:")) {
      const match = content.match(/\[ESG_REPORT:(.*?)\]/);
      if (match && match[1]) {
        const reportType = match[1].trim();
        // Navigate to the reports page with the specific report type
        setTimeout(() => {
          navigate(`/reports?type=${reportType}`);
          toast.info(`Opening ${reportType} report`);
        }, 1000);
      }
    }
    
    // Carbon footprint analysis navigation
    if (content.includes("[CARBON_ANALYSIS:")) {
      const match = content.match(/\[CARBON_ANALYSIS:(.*?)\]/);
      if (match && match[1]) {
        const scope = match[1].trim();
        // Navigate to carbon analysis with specific scope
        setTimeout(() => {
          navigate(`/analytics?tab=carbon&scope=${scope}`);
          toast.info(`Opening carbon analysis for ${scope}`);
        }, 1000);
      }
    }
    
    // Compliance check navigation
    if (content.includes("[COMPLIANCE_CHECK:")) {
      const match = content.match(/\[COMPLIANCE_CHECK:(.*?)\]/);
      if (match && match[1]) {
        const framework = match[1].trim();
        // Navigate to compliance page with specific framework
        setTimeout(() => {
          navigate(`/compliance?framework=${framework}`);
          toast.info(`Checking compliance for ${framework}`);
        }, 1000);
      }
    }
  };

  return null; // This is a behavior-only component with no UI
};

export default NavigationListener;
