
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
    
    // Force immediate chat button visibility
    const showChatButton = () => {
      const chatButton = document.getElementById('chat-button');
      if (chatButton) {
        chatButton.style.visibility = 'visible';
        chatButton.style.opacity = '1';
        chatButton.style.display = 'block';
        chatButton.style.zIndex = '999999';
        console.log("Forced chat button visibility from App component");
      }
      
      // Also ensure the container is visible
      const walyContainer = document.getElementById('waly-container');
      if (walyContainer) {
        walyContainer.style.visibility = 'visible';
        walyContainer.style.opacity = '1';
        walyContainer.style.display = 'block';
        walyContainer.style.zIndex = '999999';
        console.log("Forced waly container visibility from App component");
      }
    };
    
    // Call immediately and also after delays to handle any race conditions
    showChatButton();
    
    // Try multiple times to ensure visibility
    const intervals = [100, 300, 500, 1000, 2000, 3000, 5000].map(delay => 
      setTimeout(showChatButton, delay)
    );
    
    return () => intervals.forEach(clearTimeout);
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
        
        {/* Always render the EnhancedWalyAssistant with maximum z-index and forced visibility */}
        <div 
          id="waly-container"
          className="fixed bottom-0 right-0 z-[999999]" 
          style={{ 
            opacity: 1, 
            visibility: 'visible', 
            display: 'block',
            zIndex: 999999
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
