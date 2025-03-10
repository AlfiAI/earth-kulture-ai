
import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import * as routes from './routes/routes';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import EnhancedWalyAssistant from '@/components/ai/EnhancedWalyAssistant';
import WalyActionHandler from '@/components/ai/WalyActionHandler';

function App() {
  const location = useLocation();
  const walyVisibilityChecked = useRef(false);
  const walyContainerRef = useRef<HTMLDivElement>(null);
  
  // Make sure Waly is visible with extremely aggressive approach
  useEffect(() => {
    console.log('App: Current route is', location.pathname);
    walyVisibilityChecked.current = false;
    
    // Force visibility of Waly components with most aggressive approach
    const forceWalyVisibility = () => {
      // Target container and chat button
      ['waly-container', 'chat-button'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.setAttribute('style', `
            visibility: visible !important;
            opacity: 1 !important;
            display: block !important;
            z-index: 9999999 !important;
            position: fixed !important;
            pointer-events: auto !important;
            transform: none !important;
          `);
          walyVisibilityChecked.current = true;
        }
      });
      
      // Also ensure our ref is visible
      if (walyContainerRef.current) {
        walyContainerRef.current.setAttribute('style', `
          visibility: visible !important;
          opacity: 1 !important;
          display: block !important;
          z-index: 9999999 !important;
          position: fixed !important;
          pointer-events: auto !important;
          transform: none !important;
        `);
      }
    };
    
    // Create a robust visibility observer
    const createVisibilityObserver = () => {
      // Use MutationObserver to detect DOM changes that might affect Waly visibility
      const observer = new MutationObserver((mutations) => {
        forceWalyVisibility();
      });
      
      // Start observing the document body for all changes
      observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true
      });
      
      return observer;
    };
    
    // Call multiple times with different delays to ensure it works
    [0, 50, 100, 200, 300, 500, 1000, 2000, 5000].forEach(delay => {
      setTimeout(forceWalyVisibility, delay);
    });
    
    // Create the observer
    const observer = createVisibilityObserver();
    
    // Also check periodically
    const interval = setInterval(() => {
      forceWalyVisibility();
    }, 500);
    
    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
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
        
        {/* Always render Waly with aggressive inline styles for guaranteed visibility */}
        <div 
          id="waly-container"
          ref={walyContainerRef}
          className="fixed bottom-0 right-0 z-[9999999]" 
          style={{ 
            visibility: "visible",
            display: 'block',
            opacity: 1,
            zIndex: 9999999,
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            pointerEvents: 'auto'
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
