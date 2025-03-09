
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import * as routes from './routes/routes';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import EnhancedWalyAssistant from '@/components/ai/EnhancedWalyAssistant';
import WalyActionHandler from '@/components/ai/WalyActionHandler';

function App() {
  return (
    <WalyActionHandler>
      <div className="min-h-screen flex flex-col">
        <Routes>
          {routes.router.routes
            .filter(route => route.path !== undefined)
            .map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element as React.ReactNode}
              />
            ))
          }
        </Routes>
        <EnhancedWalyAssistant />
        <Toaster />
        <SonnerToaster position="top-center" />
      </div>
    </WalyActionHandler>
  );
}

export default App;
