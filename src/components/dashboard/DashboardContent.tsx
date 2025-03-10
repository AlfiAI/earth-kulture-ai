
import { useDashboard } from "@/contexts/dashboard/DashboardContext";
import CarbonFootprint from "./CarbonFootprint";
import DashboardESGScore from "./DashboardESGScore";
import ComplianceStatus from "./ComplianceStatus";
import ActivityFeed from "./ActivityFeed";
import AIInsights from "./AIInsights";
import PredictiveInsights from "@/components/predictive/PredictiveInsights";
import { motion } from "framer-motion";

const DashboardContent = () => {
  const { dashboardType } = useDashboard();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {dashboardType === 'individual' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
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
          
          <motion.div variants={itemVariants} className="mb-6 ai-insights">
            <AIInsights />
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
