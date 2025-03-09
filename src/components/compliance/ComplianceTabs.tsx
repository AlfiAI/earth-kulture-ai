
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComplianceItemCard, { ComplianceItemType } from "./ComplianceItemCard";

type ComplianceTabsProps = {
  complianceItems: ComplianceItemType[];
};

const ComplianceTabs = ({ complianceItems }: ComplianceTabsProps) => {
  return (
    <Tabs defaultValue="all">
      <TabsList className="mb-4">
        <TabsTrigger value="all">All Frameworks</TabsTrigger>
        <TabsTrigger value="compliant">Compliant</TabsTrigger>
        <TabsTrigger value="in-progress">In Progress</TabsTrigger>
        <TabsTrigger value="attention">Attention Needed</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="space-y-4">
        {complianceItems.map((item, index) => (
          <ComplianceItemCard key={index} item={item} />
        ))}
      </TabsContent>
      
      <TabsContent value="compliant" className="space-y-4">
        {complianceItems.filter(item => item.status === 'Compliant').map((item, index) => (
          <ComplianceItemCard key={index} item={item} />
        ))}
      </TabsContent>
      
      <TabsContent value="in-progress" className="space-y-4">
        {complianceItems.filter(item => item.status === 'In Progress').map((item, index) => (
          <ComplianceItemCard key={index} item={item} />
        ))}
      </TabsContent>
      
      <TabsContent value="attention" className="space-y-4">
        {complianceItems.filter(item => item.status === 'Attention Needed').map((item, index) => (
          <ComplianceItemCard key={index} item={item} />
        ))}
      </TabsContent>
    </Tabs>
  );
};

export default ComplianceTabs;
