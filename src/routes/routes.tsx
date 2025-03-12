
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth";
import App from "@/App";

// Core pages
import AuthPage from "@/pages/AuthPage";
import DashboardPage from "@/pages/Index";  // Use existing Index as DashboardPage
import BenchmarkDashboard from "@/pages/BenchmarkDashboard";
import BenchmarkingPage from "@/pages/BenchmarkingPage";
import NotFoundPage from "@/pages/NotFound";  // Use existing NotFound
import ErrorPage from "@/pages/NotFound";  // Use NotFound as ErrorPage
import Compliance from "@/pages/Compliance";
import Analytics from "@/pages/Analytics";
import Goals from "@/pages/Goals";
import DataCenter from "@/pages/DataCenter";  
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import ExternalData from "@/pages/ExternalData";
import Insights from "@/pages/Insights";
import AIInsights from "@/pages/AIInsights";
import About from "@/pages/About";
import Features from "@/pages/Features";
import Pricing from "@/pages/Pricing";
import Landing from "@/pages/Landing";
import Onboarding from "@/pages/Onboarding";

// New pages to fix 404 errors
import Documentation from "@/pages/Documentation";
import Support from "@/pages/Support";
import AIAssistant from "@/pages/AIAssistant";

// Root component that wraps everything with AuthProvider and includes App for non-route components
const Root = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "/login",
        element: <AuthPage />,
      },
      {
        path: "/signup",
        element: <AuthPage />,
      },
      {
        path: "/auth",
        element: <AuthPage />,
      },
      {
        path: "/forgot-password",
        element: <AuthPage />,
      },
      {
        path: "/setup-mfa",
        element: <AuthPage />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/features",
        element: <Features />,
      },
      {
        path: "/pricing",
        element: <Pricing />,
      },
      // Make all dashboard routes accessible without authentication
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/app",
        element: <DashboardPage />,
      },
      {
        path: "/analytics",
        element: <Analytics />,
      },
      {
        path: "/compliance",
        element: <Compliance />,
      },
      {
        path: "/goals",
        element: <Goals />,
      },
      {
        path: "/data",
        element: <DataCenter />,
      },
      {
        path: "/reports",
        element: <Reports />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/benchmark",
        element: <BenchmarkDashboard />,
      },
      {
        path: "/benchmark-dashboard",
        element: <BenchmarkDashboard />,
      },
      {
        path: "/external-data",
        element: <ExternalData />,
      },
      {
        path: "/insights",
        element: <Insights />,
      },
      {
        path: "/ai-insights",
        element: <AIInsights />,
      },
      {
        path: "/benchmarking",
        element: <BenchmarkingPage />,
      },
      {
        path: "/onboarding",
        element: <Onboarding />,
      },
      // New routes for previously missing pages
      {
        path: "/documentation",
        element: <Documentation />,
      },
      {
        path: "/support",
        element: <Support />,
      },
      {
        path: "/ai-assistant",
        element: <AIAssistant />,
      },
      {
        path: "/demo",
        element: <DashboardPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
