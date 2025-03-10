
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import * as routes from './routes/routes';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import EnhancedWalyAssistant from '@/components/ai/EnhancedWalyAssistant';
import WalyActionHandler from '@/components/ai/WalyActionHandler';
import { useWalyInjector } from '@/hooks/use-waly-injector';

function App() {
  const location = useLocation();
  
  // Use the Waly injector to ensure visibility
  useWalyInjector();
  
  // Create and maintain Waly container
  useEffect(() => {
    console.log('App: Current route is', location.pathname);
    console.log('Ensuring Waly container exists');
    
    // Create Waly container if it doesn't exist
    if (!document.getElementById('waly-container')) {
      console.log('Creating waly-container in App component');
      const container = document.createElement('div');
      container.id = 'waly-container';
      container.style.cssText = `
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        z-index: 99999999 !important;
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
          {routes.router.routes
            .filter(route => route.path !== undefined)
            .map((route) => {
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
        
        {/* Render Waly with clear positioning and high z-index */}
        <div 
          id="waly-container"
          className="fixed bottom-0 right-0" 
          style={{ 
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 99999999,
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
