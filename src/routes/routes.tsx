
import { createBrowserRouter } from "react-router-dom";
import AuthPage from "@/pages/AuthPage";
import Landing from "@/pages/Landing";
import Features from "@/pages/Features";
import Pricing from "@/pages/Pricing";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Analytics from "@/pages/Analytics";
import Compliance from "@/pages/Compliance";
import DataCenter from "@/pages/DataCenter";
import AIInsights from "@/pages/AIInsights";
import Reports from "@/pages/Reports";
import Goals from "@/pages/Goals";
import Settings from "@/pages/Settings";
import Support from "@/pages/Support";
import Documentation from "@/pages/Documentation";
import Onboarding from "@/pages/Onboarding";
import BenchmarkDashboard from "@/pages/BenchmarkDashboard";
import ExternalData from "@/pages/ExternalData";
import Insights from "@/pages/Insights";
import AIAssistant from "@/pages/AIAssistant";
import BenchmarkingPage from "@/pages/BenchmarkingPage";
import Benchmarking from "@/pages/Benchmarking";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
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
    path: "/about",
    element: <About />,
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute />,
    // This will be the default dashboard view
    children: [
      {
        path: "",
        element: <Analytics />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "onboarding",
        element: <Onboarding />,
      },
    ],
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
    path: "/data",
    element: <ProtectedRoute><DataCenter /></ProtectedRoute>,
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
    path: "/reports",
    element: <ProtectedRoute><Reports /></ProtectedRoute>,
  },
  {
    path: "/goals",
    element: <ProtectedRoute><Goals /></ProtectedRoute>,
  },
  {
    path: "/support",
    element: <ProtectedRoute><Support /></ProtectedRoute>,
  },
  {
    path: "/documentation",
    element: <ProtectedRoute><Documentation /></ProtectedRoute>,
  },
  {
    path: "/benchmark-dashboard",
    element: <ProtectedRoute><BenchmarkDashboard /></ProtectedRoute>,
  },
  {
    path: "/benchmarking",
    element: <ProtectedRoute><BenchmarkingPage /></ProtectedRoute>,
  },
  {
    path: "/ai-assistant",
    element: <ProtectedRoute><AIAssistant /></ProtectedRoute>,
  },
  {
    path: "/advanced-benchmarking",
    element: <ProtectedRoute><Benchmarking /></ProtectedRoute>,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
