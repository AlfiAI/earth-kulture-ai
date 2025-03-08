
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import AuthPage from "@/pages/AuthPage";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Features from "@/pages/Features";
import Pricing from "@/pages/Pricing";
import NotFound from "@/pages/NotFound";
import Landing from "@/pages/Landing";
import Analytics from "@/pages/Analytics";
import Compliance from "@/pages/Compliance";
import Goals from "@/pages/Goals";
import DataCenter from "@/pages/DataCenter";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import BenchmarkDashboard from "@/pages/BenchmarkDashboard";
import ExternalData from "@/pages/ExternalData";
import Insights from "@/pages/Insights";
import Onboarding from "@/pages/Onboarding";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AIInsights from "@/pages/AIInsights";
import WalyAssistant from "@/components/ai/WalyAssistant";
import EnhancedWalyAssistant from "@/components/ai/EnhancedWalyAssistant";

import "@/App.css";

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/" element={<Landing />} />
        
        {/* Protected routes */}
        <Route path="/app" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/compliance" element={<ProtectedRoute><Compliance /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="/data" element={<ProtectedRoute><DataCenter /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/benchmark" element={<ProtectedRoute><BenchmarkDashboard /></ProtectedRoute>} />
        <Route path="/external-data" element={<ProtectedRoute><ExternalData /></ProtectedRoute>} />
        <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/ai-insights" element={<ProtectedRoute><AIInsights /></ProtectedRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <EnhancedWalyAssistant initialOpen={false} />
      <Toaster />
    </>
  );
}

export default App;
