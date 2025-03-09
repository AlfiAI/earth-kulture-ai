
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import * as routes from './routes/routes';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import EnhancedWalyAssistant from '@/components/ai/EnhancedWalyAssistant';
import WalyActionHandler from '@/components/ai/WalyActionHandler';

function App() {
  const location = useLocation();
  
  // Debug logging and force visibility
  useEffect(() => {
    console.log('App rendered, current route:', location.pathname);
    console.log('EnhancedWalyAssistant should be visible on all pages');
    
    // Force the chat button to be visible immediately
    const chatButton = document.getElementById('chat-button');
    if (chatButton) {
      chatButton.style.visibility = 'visible';
      chatButton.style.opacity = '1';
      console.log("Forced chat button visibility from App component");
    }
    
    // Recheck after a short delay to ensure visibility
    const recheckTimer = setTimeout(() => {
      const chatButtonAgain = document.getElementById('chat-button');
      if (chatButtonAgain) {
        chatButtonAgain.style.visibility = 'visible';
        chatButtonAgain.style.opacity = '1';
        console.log("Rechecked chat button visibility from App component");
      }
    }, 500);
    
    return () => clearTimeout(recheckTimer);
  }, [location.pathname]);

  return (
    <WalyActionHandler>
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* Render all the routes defined in routes.tsx */}
          {routes.router.routes
            .filter(route => route.path !== undefined)
            .map((route) => {
              // TypeScript doesn't recognize the element property directly
              // Use a type assertion to access it safely
              const routeObject = route as unknown as { path?: string; element?: React.ReactNode };
              
              return routeObject.path ? (
                <Route
                  key={routeObject.path}
                  path={routeObject.path}
                  element={routeObject.element || null}
                />
              ) : null;
            })}
        </Routes>
        
        {/* Always render the EnhancedWalyAssistant with maximum z-index */}
        <div 
          className="fixed bottom-0 right-0 z-[99999] visible pointer-events-auto" 
          style={{ 
            opacity: 1, 
            visibility: 'visible', 
            display: 'block' 
          }}
        >
          <EnhancedWalyAssistant initialOpen={false} />
        </div>
        
        <Toaster />
        <SonnerToaster position="top-center" />
      </div>
    </WalyActionHandler>
  );
}

export default App;
