
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Database, Globe } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ExternalDataHeader from "@/components/external/ExternalDataHeader";
import ExternalDataSearch from "@/components/external/ExternalDataSearch";
import RegulationsTab from "@/components/external/tabs/RegulationsTab";
import BenchmarksTab from "@/components/external/tabs/BenchmarksTab";
import DatasetsTab from "@/components/external/tabs/DatasetsTab";

const ExternalData = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <ExternalDataHeader />
        <ExternalDataSearch />

        <Tabs defaultValue="regulations">
          <TabsList className="mb-4">
            <TabsTrigger value="regulations">
              <FileText className="h-4 w-4 mr-2" />
              Regulations
            </TabsTrigger>
            <TabsTrigger value="benchmarks">
              <Database className="h-4 w-4 mr-2" />
              Industry Benchmarks
            </TabsTrigger>
            <TabsTrigger value="datasets">
              <Globe className="h-4 w-4 mr-2" />
              Public Datasets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="regulations" className="space-y-4">
            <RegulationsTab />
          </TabsContent>

          <TabsContent value="benchmarks" className="space-y-4">
            <BenchmarksTab />
          </TabsContent>

          <TabsContent value="datasets" className="space-y-4">
            <DatasetsTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ExternalData;
