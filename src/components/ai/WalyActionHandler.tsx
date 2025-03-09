
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface WalyActionHandlerProps {
  children: React.ReactNode;
}

/**
 * Component that listens for Waly AI action events and handles them accordingly
 */
const WalyActionHandler = ({ children }: WalyActionHandlerProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle form filling events from Waly
    const handleFormFill = (event: CustomEvent) => {
      const { fields } = event.detail;
      console.log('Waly is filling form with:', fields);
      
      // Find form inputs and fill them
      if (fields) {
        // Email fields
        if (fields.email) {
          const emailInputs = document.querySelectorAll('input[type="email"], input[placeholder*="email" i]');
          emailInputs.forEach((input: HTMLInputElement) => {
            input.value = fields.email;
            // Trigger input event to activate any listeners
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          });
        }
        
        // Name fields
        if (fields.name) {
          const nameInputs = document.querySelectorAll('input[placeholder*="name" i], input[name*="name" i]');
          nameInputs.forEach((input: HTMLInputElement) => {
            input.value = fields.name;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          });
        }
        
        // Password fields
        if (fields.needsPassword) {
          const passwordInputs = document.querySelectorAll('input[type="password"]');
          passwordInputs.forEach((input: HTMLInputElement) => {
            // Generate a secure password - simplified for demo
            const securePassword = `SecurePass${Math.floor(Math.random() * 10000)}!`;
            input.value = securePassword;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Store the password temporarily for confirmation fields
            localStorage.setItem('waly_temp_password', securePassword);
          });
        }
        
        toast.success('Form fields filled by Waly');
      }
    };
    
    // Handle authentication actions (login/signup tab selection)
    const handleAuthAction = (event: CustomEvent) => {
      const { action, params } = event.detail;
      console.log('Waly auth action:', action, params);
      
      // Find and click the appropriate tab trigger
      if (action === 'login' || action === 'signup') {
        setTimeout(() => {
          const tabTriggers = document.querySelectorAll('[role="tab"]');
          tabTriggers.forEach((tab: HTMLElement) => {
            if (
              (action === 'login' && tab.textContent?.toLowerCase().includes('login')) ||
              (action === 'signup' && tab.textContent?.toLowerCase().includes('sign up'))
            ) {
              tab.click();
              toast.info(`Switched to ${action} tab`);
            }
          });
        }, 500);
      }
    };
    
    // Handle specific actions like showing charts or running benchmarks
    const handleSpecificAction = (event: CustomEvent) => {
      const { action, params } = event.detail;
      console.log('Waly specific action:', action, params);
      
      switch (action) {
        case 'showChart':
          // Find and click the appropriate chart tab
          setTimeout(() => {
            const chartTabs = document.querySelectorAll('[role="tab"]');
            chartTabs.forEach((tab: HTMLElement) => {
              if (
                params?.type && 
                tab.textContent?.toLowerCase().includes(params.type.toLowerCase())
              ) {
                tab.click();
                toast.info(`Showing ${params.type} chart`);
              }
            });
          }, 500);
          break;
          
        case 'runBenchmark':
          // Find and click the benchmark button
          setTimeout(() => {
            const benchmarkButtons = Array.from(document.querySelectorAll('button')).filter(
              button => {
                const buttonElement = button as HTMLButtonElement;
                return buttonElement.textContent?.toLowerCase().includes('benchmark') ||
                      buttonElement.textContent?.toLowerCase().includes('compare');
              }
            );
            
            if (benchmarkButtons.length > 0) {
              (benchmarkButtons[0] as HTMLButtonElement).click();
              toast.info('Running benchmark comparison');
            }
          }, 500);
          break;
          
        default:
          console.log('Unknown specific action:', action);
      }
    };
    
    // Add event listeners
    window.addEventListener('waly-fill-form', handleFormFill as EventListener);
    window.addEventListener('waly-auth-action', handleAuthAction as EventListener);
    window.addEventListener('waly-action', handleSpecificAction as EventListener);
    
    // Auto-submit forms with a delay after filling
    const submitFormsAfterFilling = () => {
      setTimeout(() => {
        // Look for submit buttons within forms
        const submitButtons = Array.from(document.querySelectorAll('form button[type="submit"]')).filter(
          button => !button.hasAttribute('disabled')
        );
        
        if (submitButtons.length > 0) {
          // Click the first enabled submit button
          (submitButtons[0] as HTMLButtonElement).click();
          toast.success('Form submitted by Waly');
        }
      }, 2000); // Delay to allow form validation
    };
    
    window.addEventListener('waly-fill-form', submitFormsAfterFilling as EventListener);
    
    // Cleanup
    return () => {
      window.removeEventListener('waly-fill-form', handleFormFill as EventListener);
      window.removeEventListener('waly-auth-action', handleAuthAction as EventListener);
      window.removeEventListener('waly-action', handleSpecificAction as EventListener);
      window.removeEventListener('waly-fill-form', submitFormsAfterFilling as EventListener);
    };
  }, [navigate]);

  return <>{children}</>;
};

export default WalyActionHandler;
