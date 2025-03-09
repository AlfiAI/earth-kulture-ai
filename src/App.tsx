
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import * as routes from './routes/routes';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import EnhancedWalyAssistant from '@/components/ai/EnhancedWalyAssistant';
import WalyActionHandler from '@/components/ai/WalyActionHandler';

function App() {
  const location = useLocation();
  
  // Make sure Waly is visible, especially on index page
  useEffect(() => {
    console.log('App: Current route is', location.pathname);
    
    // Force visibility of Waly components
    const forceWalyVisibility = () => {
      // Target container and chat button
      ['waly-container', 'chat-button'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.style.visibility = 'visible';
          el.style.opacity = '1';
          el.style.display = 'block';
          el.style.zIndex = '999999';
        }
      });
    };
    
    // Index page needs special handling
    if (location.pathname === '/') {
      console.log('On index page - ensuring Waly is visible');
      // Call multiple times with different delays to ensure it works
      [0, 100, 500, 1000].forEach(delay => {
        setTimeout(forceWalyVisibility, delay);
      });
    }
    
    // Call immediately and also on a timer
    forceWalyVisibility();
    const interval = setInterval(forceWalyVisibility, 2000);
    
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
