
import { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DataSourceTabsProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}

const DataSourceTabs = ({ selectedTab, onTabChange, children }: DataSourceTabsProps) => {
  return (
    <Tabs defaultValue="all" value={selectedTab} onValueChange={onTabChange}>
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="environmental">Environmental</TabsTrigger>
        <TabsTrigger value="carbon">Carbon</TabsTrigger>
        <TabsTrigger value="social">Social</TabsTrigger>
      </TabsList>
      
      <TabsContent value={selectedTab} className="pt-2">
        {children}
      </TabsContent>
    </Tabs>
  );
};

export default DataSourceTabs;
