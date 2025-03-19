
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageContainer from "@/components/ui/patterns/PageContainer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SupplyChainTab from "@/components/benchmarking/supply-chain/SupplyChainTab";
import ARIESModelingTab from "@/components/benchmarking/aries/ARIESModelingTab";
import ESGScoresTab from "@/components/benchmarking/esg-scores/ESGScoresTab";
import MaterialsAnalysisTab from "@/components/benchmarking/materials/MaterialsAnalysisTab";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";

const Benchmarking = () => {
  return (
    <DashboardLayout>
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Advanced Benchmarking & Analysis</CardTitle>
              <CardDescription>
                Compare your sustainability performance against industry standards, analyze your supply chain,
                model environmental impacts, and assess materials sustainability.
              </CardDescription>
            </CardHeader>
          </Card>

          <Tabs defaultValue="supply-chain" className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="supply-chain">Supply Chain</TabsTrigger>
              <TabsTrigger value="aries-modeling">ARIES Modeling</TabsTrigger>
              <TabsTrigger value="esg-scores">ESG Scores</TabsTrigger>
              <TabsTrigger value="materials">Materials Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="supply-chain" className="space-y-4">
              <SupplyChainTab />
            </TabsContent>

            <TabsContent value="aries-modeling" className="space-y-4">
              <ARIESModelingTab />
            </TabsContent>

            <TabsContent value="esg-scores" className="space-y-4">
              <ESGScoresTab />
            </TabsContent>

            <TabsContent value="materials" className="space-y-4">
              <MaterialsAnalysisTab />
            </TabsContent>
          </Tabs>
        </motion.div>
      </PageContainer>
    </DashboardLayout>
  );
};

export default Benchmarking;
