
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

// Auth & Onboarding
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import SetupMFAPage from "@/pages/SetupMFAPage";

// Dashboard & Analytics
import DashboardPage from "@/pages/DashboardPage";
import BenchmarkDashboard from "@/pages/BenchmarkDashboard";
import BenchmarkingPage from "@/pages/BenchmarkingPage";

// Data & Management
import DataManagementPage from "@/pages/DataManagementPage";
import ESGReportsPage from "@/pages/ESGReportsPage";
import UserSettingsPage from "@/pages/UserSettingsPage";

// Compliance & Tools
import ComplianceFrameworksPage from "@/pages/ComplianceFrameworksPage";
import RegulatoryUpdatesPage from "@/pages/RegulatoryUpdatesPage";
import CarbonCalculatorPage from "@/pages/CarbonCalculatorPage";
import AIAssistantPage from "@/pages/AIAssistantPage";

// Documentation & Help
import DocumentationPage from "@/pages/DocumentationPage";
import SupportPage from "@/pages/SupportPage";

// Error Pages
import ErrorPage from "@/pages/ErrorPage";
import NotFoundPage from "@/pages/NotFoundPage";

// Protected route layout
import AuthGuard from "@/components/auth/AuthGuard";

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
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "setup-mfa",
        element: <SetupMFAPage />,
      },
      {
        path: "dashboard",
        element: <AuthGuard><DashboardPage /></AuthGuard>,
      },
      {
        path: "benchmark-dashboard",
        element: <AuthGuard><BenchmarkDashboard /></AuthGuard>,
      },
      {
        path: "benchmarking",
        element: <AuthGuard><BenchmarkingPage /></AuthGuard>,
      },
      {
        path: "data-management",
        element: <AuthGuard><DataManagementPage /></AuthGuard>,
      },
      {
        path: "esg-reports",
        element: <AuthGuard><ESGReportsPage /></AuthGuard>,
      },
      {
        path: "user-settings",
        element: <AuthGuard><UserSettingsPage /></AuthGuard>,
      },
      {
        path: "compliance-frameworks",
        element: <AuthGuard><ComplianceFrameworksPage /></AuthGuard>,
      },
      {
        path: "regulatory-updates",
        element: <AuthGuard><RegulatoryUpdatesPage /></AuthGuard>,
      },
      {
        path: "carbon-calculator",
        element: <AuthGuard><CarbonCalculatorPage /></AuthGuard>,
      },
      {
        path: "ai-assistant",
        element: <AuthGuard><AIAssistantPage /></AuthGuard>,
      },
      {
        path: "documentation",
        element: <DocumentationPage />,
      },
      {
        path: "support",
        element: <SupportPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
