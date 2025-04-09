
import { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import WalyActionHandler from '@/components/ai/WalyActionHandler';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProviderWithRouter } from '@/contexts/auth/AuthProviderWithRouter';
import ErrorBoundary from '@/components/error/ErrorBoundary';

function App() {
  const location = useLocation();
  
  useEffect(() => {
    console.log('App: Current route is', location.pathname);
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <TooltipProvider>
        <WalyActionHandler>
          <AuthProviderWithRouter>
            <div className="min-h-screen flex flex-col">
              <Outlet />
              <Toaster />
              <SonnerToaster position="top-center" />
            </div>
          </AuthProviderWithRouter>
        </WalyActionHandler>
      </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;
