import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
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

// Protected route layout
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Root component that wraps everything with AuthProvider and includes App for non-route components
const Root = () => (
  <AuthProvider>
    <Outlet />
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
      {
        path: "/dashboard",
        element: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
      },
      {
        path: "/app",
        element: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
      },
      {
        path: "/analytics",
        element: <ProtectedRoute><Analytics /></ProtectedRoute>,
      },
      {
        path: "/compliance",
        element: <ProtectedRoute><Compliance /></ProtectedRoute>,
      },
      {
        path: "/goals",
        element: <ProtectedRoute><Goals /></ProtectedRoute>,
      },
      {
        path: "/data",
        element: <ProtectedRoute><DataCenter /></ProtectedRoute>,
      },
      {
        path: "/reports",
        element: <ProtectedRoute><Reports /></ProtectedRoute>,
      },
      {
        path: "/settings",
        element: <ProtectedRoute><Settings /></ProtectedRoute>,
      },
      {
        path: "/benchmark",
        element: <ProtectedRoute><BenchmarkDashboard /></ProtectedRoute>,
      },
      {
        path: "/benchmark-dashboard",
        element: <ProtectedRoute><BenchmarkDashboard /></ProtectedRoute>,
      },
      {
        path: "/external-data",
        element: <ProtectedRoute><ExternalData /></ProtectedRoute>,
      },
      {
        path: "/insights",
        element: <ProtectedRoute><Insights /></ProtectedRoute>,
      },
      {
        path: "/ai-insights",
        element: <ProtectedRoute><AIInsights /></ProtectedRoute>,
      },
      {
        path: "/benchmarking",
        element: <ProtectedRoute><BenchmarkingPage /></ProtectedRoute>,
      },
      {
        path: "/onboarding",
        element: <ProtectedRoute><Onboarding /></ProtectedRoute>,
      },
      // New routes for previously missing pages
      {
        path: "/documentation",
        element: <ProtectedRoute><Documentation /></ProtectedRoute>,
      },
      {
        path: "/support",
        element: <ProtectedRoute><Support /></ProtectedRoute>,
      },
      {
        path: "/ai-assistant",
        element: <ProtectedRoute><AIAssistant /></ProtectedRoute>,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
