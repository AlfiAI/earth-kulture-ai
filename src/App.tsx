
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import * as routes from './routes/routes';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import WalyActionHandler from '@/components/ai/WalyActionHandler';

function App() {
  const location = useLocation();
  
  useEffect(() => {
    console.log('App: Current route is', location.pathname);
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
        
        <Toaster />
        <SonnerToaster position="top-center" />
      </div>
    </WalyActionHandler>
  );
}

export default App;
