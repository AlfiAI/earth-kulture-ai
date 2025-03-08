
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

// Pages
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Features from "@/pages/Features";
import Landing from "@/pages/Landing";
import DataCenter from "@/pages/DataCenter";
import ExternalData from "@/pages/ExternalData";
import Analytics from "@/pages/Analytics";
import Compliance from "@/pages/Compliance";
import Reports from "@/pages/Reports";
import Goals from "@/pages/Goals";
import BenchmarkDashboard from "@/pages/BenchmarkDashboard";
import Insights from "@/pages/Insights";
import Settings from "@/pages/Settings";
import Pricing from "@/pages/Pricing";
import Onboarding from "@/pages/Onboarding";

// Auth Components
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthProvider } from "@/contexts/auth";

// UI/UX Components
import WalyAssistant from "@/components/ai/WalyAssistant";
import EnhancedWalyAssistant from "@/components/ai/EnhancedWalyAssistant";

import "./App.css";

function App() {
  // Check if user is subscribed to Pro plan - this would typically come from user data
  const userIsPro = true; // For demo purposes

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/pricing" element={<Pricing />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/data"
            element={
              <ProtectedRoute>
                <DataCenter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/external-data"
            element={
              <ProtectedRoute>
                <ExternalData />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/compliance"
            element={
              <ProtectedRoute>
                <Compliance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/benchmarks"
            element={
              <ProtectedRoute>
                <BenchmarkDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/insights"
            element={
              <ProtectedRoute>
                <Insights />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* AI Assistant */}
        {userIsPro ? <EnhancedWalyAssistant /> : <WalyAssistant />}

        {/* Toast notifications */}
        <Toaster />
        <SonnerToaster position="bottom-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
