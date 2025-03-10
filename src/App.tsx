
import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import * as routes from './routes/routes';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import EnhancedWalyAssistant from '@/components/ai/EnhancedWalyAssistant';
import WalyActionHandler from '@/components/ai/WalyActionHandler';

function App() {
  const location = useLocation();
  const walyContainerRef = useRef<HTMLDivElement>(null);
  
  // Simple visibility check for Waly
  useEffect(() => {
    console.log('App: Current route is', location.pathname);
    
    // Create Waly container if it doesn't exist
    if (!document.getElementById('waly-container')) {
      const container = document.createElement('div');
      container.id = 'waly-container';
      container.className = 'fixed bottom-0 right-0 z-[9999999]';
      container.style.cssText = `
        position: fixed !important;
        bottom: 2rem !important;
        right: 2rem !important;
        z-index: 9999999 !important;
        visibility: visible !important;
        display: block !important;
        opacity: 1 !important;
      `;
      document.body.appendChild(container);
    }
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
        
        {/* Always render Waly with clear positioning */}
        <div 
          id="waly-container"
          ref={walyContainerRef}
          className="fixed bottom-0 right-0 z-[9999999]" 
          style={{ 
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 9999999,
            visibility: 'visible',
            display: 'block',
            opacity: 1
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
