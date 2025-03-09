
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

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

// Protected route layout
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const Root = () => <Outlet />;

export const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "login",
        element: <AuthPage />,
      },
      {
        path: "signup",
        element: <AuthPage />,
      },
      {
        path: "forgot-password",
        element: <AuthPage />,
      },
      {
        path: "setup-mfa",
        element: <AuthPage />,
      },
      {
        path: "dashboard",
        element: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
      },
      {
        path: "analytics",
        element: <ProtectedRoute><Analytics /></ProtectedRoute>,
      },
      {
        path: "compliance",
        element: <ProtectedRoute><Compliance /></ProtectedRoute>,
      },
      {
        path: "goals",
        element: <ProtectedRoute><Goals /></ProtectedRoute>,
      },
      {
        path: "data",
        element: <ProtectedRoute><DataCenter /></ProtectedRoute>,
      },
      {
        path: "reports",
        element: <ProtectedRoute><Reports /></ProtectedRoute>,
      },
      {
        path: "settings",
        element: <ProtectedRoute><Settings /></ProtectedRoute>,
      },
      {
        path: "benchmark",
        element: <ProtectedRoute><BenchmarkDashboard /></ProtectedRoute>,
      },
      {
        path: "benchmark-dashboard",
        element: <ProtectedRoute><BenchmarkDashboard /></ProtectedRoute>,
      },
      {
        path: "external-data",
        element: <ProtectedRoute><ExternalData /></ProtectedRoute>,
      },
      {
        path: "insights",
        element: <ProtectedRoute><Insights /></ProtectedRoute>,
      },
      {
        path: "ai-insights",
        element: <ProtectedRoute><AIInsights /></ProtectedRoute>,
      },
      {
        path: "benchmarking",
        element: <ProtectedRoute><BenchmarkingPage /></ProtectedRoute>,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
