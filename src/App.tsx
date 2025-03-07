
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Compliance from "./pages/Compliance";
import Insights from "./pages/Insights";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import About from "./pages/About";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Reports from "./pages/Reports";
import DataCenter from "./pages/DataCenter";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import BenchmarkDashboard from "./pages/BenchmarkDashboard";
import Goals from "./pages/Goals";
import { AuthProvider } from "./contexts/auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/data" element={<DataCenter />} />
            <Route path="/benchmarks" element={<BenchmarkDashboard />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
