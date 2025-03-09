
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/auth";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/routes";
import App from './App.tsx'
import './index.css'

// Initialize error tracking
import { initErrorTracking } from '@/services/monitoring/errorTracking';
initErrorTracking();

// Create a react-query client
const queryClient = new QueryClient();

// Create a new router that wraps the AuthProvider inside the routes
const root = createRoot(document.getElementById("root")!);

// Render the application
root.render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
