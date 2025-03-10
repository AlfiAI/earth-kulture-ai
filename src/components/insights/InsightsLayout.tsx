
import { ReactNode } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface InsightsLayoutProps {
  children: ReactNode;
}

const InsightsLayout = ({ children }: InsightsLayoutProps) => {
  return (
    <DashboardLayout>
      <div className="py-6 px-6">
        {children}
      </div>
    </DashboardLayout>
  );
};

export default InsightsLayout;
