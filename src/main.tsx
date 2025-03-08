
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/auth";
import App from './App.tsx'
import './index.css'

// Initialize error tracking
import { initErrorTracking } from '@/services/monitoring/errorTracking';
initErrorTracking();

// Create a react-query client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </QueryClientProvider>
);
