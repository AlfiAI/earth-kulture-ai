
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
  
  // Make sure Waly is visible, especially on index page
  useEffect(() => {
    console.log('App: Current route is', location.pathname);
    walyVisibilityChecked.current = false;
    
    // Force visibility of Waly components with aggressive approach
    const forceWalyVisibility = () => {
      // Target container and chat button
      ['waly-container', 'chat-button'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.style.visibility = 'visible';
          el.style.opacity = '1';
          el.style.display = 'block';
          el.style.zIndex = '999999';
          walyVisibilityChecked.current = true;
        }
      });
    };
    
    // Special handling for index page
    const isIndexPage = location.pathname === '/';
    if (isIndexPage) {
      console.log('On index page - ensuring Waly is visible with extra measures');
      
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
      
      // Call multiple times with different delays to ensure it works
      [0, 100, 300, 500, 1000, 2000].forEach(delay => {
        setTimeout(forceWalyVisibility, delay);
      });
      
      return () => observer.disconnect();
    }
    
    // Call immediately and also on a timer
    forceWalyVisibility();
    const interval = setInterval(() => {
      // If visibility has been confirmed, we can reduce check frequency
      if (walyVisibilityChecked.current) {
        clearInterval(interval);
        // Continue with less frequent checks
        const backupInterval = setInterval(forceWalyVisibility, 5000);
        setTimeout(() => clearInterval(backupInterval), 30000); // Stop after 30 seconds
      } else {
        forceWalyVisibility();
      }
    }, 1000);
    
    return () => clearInterval(interval);
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
        
        {/* Always render Waly with inline styles for guaranteed visibility */}
        <div 
          id="waly-container"
          className="fixed bottom-0 right-0 z-[999999]" 
          style={{ 
            visibility: 'visible', 
            display: 'block',
            opacity: 1,
            zIndex: 999999,
            position: 'fixed'
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
