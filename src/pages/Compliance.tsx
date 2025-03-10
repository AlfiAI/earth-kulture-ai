
import { useState } from 'react';
import InsightsLayout from "@/components/insights/InsightsLayout";
import ComplianceHeader from "@/components/compliance/ComplianceHeader";
import ComplianceDashboardSummary from "@/components/compliance/ComplianceDashboardSummary";
import ComplianceTabs from "@/components/compliance/ComplianceTabs";
import { complianceItems } from "@/data/complianceData";

const Compliance = () => {
  const [mounted, setMounted] = useState(true);

  return (
    <InsightsLayout>
      <div className="max-w-7xl mx-auto">
        <ComplianceHeader />
        <ComplianceDashboardSummary complianceItems={complianceItems} />
        <div className="mb-6">
          <ComplianceTabs complianceItems={complianceItems} />
        </div>
      </div>
    </InsightsLayout>
  );
};

export default Compliance;
