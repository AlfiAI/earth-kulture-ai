
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import * as routes from './routes/routes';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import EnhancedWalyAssistant from '@/components/ai/EnhancedWalyAssistant';
import WalyActionHandler from '@/components/ai/WalyActionHandler';

function App() {
  const location = useLocation();
  
  // Debug logging
  useEffect(() => {
    console.log('App rendered, current route:', location.pathname);
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
        {/* Ensure EnhancedWalyAssistant is always visible and initialized */}
        <EnhancedWalyAssistant initialOpen={false} />
        <Toaster />
        <SonnerToaster position="top-center" />
      </div>
    </WalyActionHandler>
  );
}

export default App;
