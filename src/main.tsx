
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import router from "@/routes/routes"; // Changed from named import to default import
import './index.css'

// Initialize error tracking
import { initErrorTracking } from '@/services/monitoring/errorTracking';
initErrorTracking();

// Create a react-query client with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      // Updated error handler for react-query v5
      meta: {
        onError: (error: Error) => {
          console.error("Data fetching error:", error);
        }
      }
    },
    mutations: {
      // Updated error handler for react-query v5
      meta: {
        onError: (error: Error) => {
          console.error("Mutation error:", error);
        }
      }
    }
  }
});

// Create a new router that wraps the AuthProvider inside the routes
const root = createRoot(document.getElementById("root")!);

// Render the application
root.render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
