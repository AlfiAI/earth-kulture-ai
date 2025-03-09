
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserIntent } from './use-intent-analyzer';

export function useActionExecutor() {
  const navigate = useNavigate();

  // Function to execute actions based on intent
  const executeUserIntent = useCallback(async (intent: UserIntent) => {
    if (intent.navigateTo) {
      // Add a small delay before navigation to allow the AI response to be displayed
      setTimeout(() => {
        navigate(intent.navigateTo!);
        toast.info(`Navigating to ${intent.navigateTo}`);
      }, 1000);
    }
    
    if (intent.performAction) {
      switch (intent.performAction) {
        case 'login':
        case 'signup':
          // Will be handled by UI after navigation
          // We'll use an event to communicate this to the auth form
          const authEvent = new CustomEvent('waly-auth-action', { 
            detail: { action: intent.performAction, params: intent.actionParams } 
          });
          window.dispatchEvent(authEvent);
          break;
          
        case 'fillForm':
          // Dispatch an event that components can listen for
          const formEvent = new CustomEvent('waly-fill-form', { 
            detail: { fields: intent.actionParams } 
          });
          window.dispatchEvent(formEvent);
          break;
          
        case 'showChart':
        case 'runBenchmark':
          // Dispatch events for these actions
          const actionEvent = new CustomEvent('waly-action', { 
            detail: { action: intent.performAction, params: intent.actionParams } 
          });
          window.dispatchEvent(actionEvent);
          break;
          
        default:
          console.log('Unknown action:', intent.performAction);
      }
    }
  }, [navigate]);

  // Look for navigation commands in AI responses
  const checkForNavigationCommand = useCallback((content: string) => {
    if (content.includes("[NAVIGATE:")) {
      const match = content.match(/\[NAVIGATE:(.*?)\]/);
      if (match && match[1]) {
        const destination = match[1].trim();
        // Navigate to the specified route
        setTimeout(() => {
          navigate(`/${destination === 'dashboard' ? '' : destination}`);
        }, 1000);
        return true;
      }
    }
    return false;
  }, [navigate]);

  return {
    executeUserIntent,
    checkForNavigationCommand,
  };
}
