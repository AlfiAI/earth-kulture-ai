
import DashboardLayout from "@/components/layout/DashboardLayout";
import ComplianceHeader from "@/components/compliance/ComplianceHeader";
import ComplianceDashboardSummary from "@/components/compliance/ComplianceDashboardSummary";
import ComplianceTabs from "@/components/compliance/ComplianceTabs";
import { complianceItems } from "@/data/complianceData";

const Compliance = () => {
  return (
    <DashboardLayout>
      <div className="px-3 py-4 md:p-6 max-w-7xl mx-auto overflow-x-hidden">
        <ComplianceHeader />
        <ComplianceDashboardSummary complianceItems={complianceItems} />
        <div className="mb-6 overflow-x-auto">
          <ComplianceTabs complianceItems={complianceItems} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Compliance;
