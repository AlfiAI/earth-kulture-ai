
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { useAuth } from "@/contexts/auth";
import { IndustryType } from "@/services/ai/orchestration/types/agentTypes";
import { aiContext } from "@/services/ai/context/aiContext";

type DashboardType = 'individual' | 'business' | 'enterprise';

interface DashboardContextType {
  dashboardType: DashboardType;
  selectedTab: string;
  industryContext: any;
  setSelectedTab: (tab: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const { userProfile } = useAuth();
  const [dashboardType, setDashboardType] = useState<DashboardType>('business');
  const [industryContext, setIndustryContext] = useState<any>(null);

  useEffect(() => {
    if (userProfile) {
      setDashboardType(userProfile.dashboard_preference || 'business');
      const industry = (userProfile.industry as IndustryType) || IndustryType.CORPORATE;
      setIndustryContext(aiContext.getIndustryContext(industry));
    }
  }, [userProfile]);

  return (
    <DashboardContext.Provider value={{
      dashboardType,
      selectedTab,
      industryContext,
      setSelectedTab
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
