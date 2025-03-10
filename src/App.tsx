
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
            will-change: auto !important;
            transition: none !important;
            filter: none !important;
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
          will-change: auto !important;
          transition: none !important;
          filter: none !important;
        `);
      }
      
      // If the waly-container doesn't exist, create it
      if (!document.getElementById('waly-container')) {
        const container = document.createElement('div');
        container.id = 'waly-container';
        container.className = 'fixed bottom-0 right-0 z-[9999999]';
        container.style.cssText = `
          visibility: visible !important;
          opacity: 1 !important;
          display: block !important;
          z-index: 9999999 !important;
          position: fixed !important;
          bottom: 2rem !important;
          right: 2rem !important;
          pointer-events: auto !important;
        `;
        document.body.appendChild(container);
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
    
    // Call multiple times with different delays to ensure it works (more frequent checks)
    [0, 10, 50, 100, 150, 200, 300, 500, 1000, 2000].forEach(delay => {
      setTimeout(forceWalyVisibility, delay);
    });
    
    // Create the observer
    const observer = createVisibilityObserver();
    
    // Also check periodically with shorter interval
    const interval = setInterval(() => {
      forceWalyVisibility();
    }, 300);
    
    // Listen for custom event
    document.addEventListener('waly-force-visibility', forceWalyVisibility);
    
    // After page loads fully
    window.addEventListener('load', forceWalyVisibility);
    
    return () => {
      clearInterval(interval);
      observer.disconnect();
      document.removeEventListener('waly-force-visibility', forceWalyVisibility);
      window.removeEventListener('load', forceWalyVisibility);
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
            pointerEvents: 'auto',
            transform: 'none',
            willChange: 'auto',
            transition: 'none',
            filter: 'none'
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
