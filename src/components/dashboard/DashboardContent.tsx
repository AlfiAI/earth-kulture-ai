
import { useDashboard } from "@/contexts/dashboard/DashboardContext";
import CarbonFootprint from "./CarbonFootprint";
import DashboardESGScore from "./DashboardESGScore";
import ComplianceStatus from "./ComplianceStatus";
import ActivityFeed from "./ActivityFeed";
import AIInsights from "./AIInsights";
import PredictiveInsights from "@/components/predictive/PredictiveInsights";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/styles/animations";

const DashboardContent = () => {
  const { dashboardType } = useDashboard();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 md:space-y-6"
    >
      {dashboardType === 'individual' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
            <motion.div variants={itemVariants} className="carbon-footprint">
              <CarbonFootprint />
            </motion.div>
            <motion.div variants={itemVariants} className="dashboard-esg-score">
              <DashboardESGScore />
            </motion.div>
          </div>
          <motion.div variants={itemVariants} className="ai-insights">
            <AIInsights />
          </motion.div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
            <motion.div variants={itemVariants} className="dashboard-esg-score">
              <DashboardESGScore />
            </motion.div>
            <motion.div variants={itemVariants} className="carbon-footprint">
              <CarbonFootprint />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ComplianceStatus />
            </motion.div>
          </div>
          
          <motion.div variants={itemVariants} className="mb-4 md:mb-6 ai-insights">
            <AIInsights />
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <PredictiveInsights />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ActivityFeed />
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default DashboardContent;
