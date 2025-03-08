
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

// Core pages
import AuthPage from "@/pages/AuthPage";
import DashboardPage from "@/pages/Index";  // Use existing Index as DashboardPage
import BenchmarkDashboard from "@/pages/BenchmarkDashboard";
import BenchmarkingPage from "@/pages/BenchmarkingPage";
import NotFoundPage from "@/pages/NotFound";  // Use existing NotFound
import ErrorPage from "@/pages/NotFound";  // Use NotFound as ErrorPage

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
        path: "benchmark-dashboard",
        element: <ProtectedRoute><BenchmarkDashboard /></ProtectedRoute>,
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
