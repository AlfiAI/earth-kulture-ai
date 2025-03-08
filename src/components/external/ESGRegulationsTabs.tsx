
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ESGRegulation } from "@/services/external/externalDataService";
import ESGRegulationsContent from "./ESGRegulationsContent";

interface ESGRegulationsTabsProps {
  activeTab: string;
  handleTabChange: (value: string) => void;
  regulations: ESGRegulation[];
  isLoading: boolean;
  handleRefresh: () => Promise<void>;
  onTagClick?: (tag: string) => void;
}

const ESGRegulationsTabs = ({
  activeTab,
  handleTabChange,
  regulations,
  isLoading,
  handleRefresh,
  onTagClick
}: ESGRegulationsTabsProps) => {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="mb-4">
        <TabsTrigger value="all">All Updates</TabsTrigger>
        <TabsTrigger value="regulation">Regulations</TabsTrigger>
        <TabsTrigger value="reporting_framework">Frameworks</TabsTrigger>
        <TabsTrigger value="guidance">Guidance</TabsTrigger>
      </TabsList>
      
      <TabsContent value={activeTab} className="mt-0">
        <ESGRegulationsContent 
          regulations={regulations} 
          isLoading={isLoading}
          handleRefresh={handleRefresh}
          onTagClick={onTagClick}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ESGRegulationsTabs;
