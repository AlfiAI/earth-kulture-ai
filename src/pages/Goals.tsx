
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SustainabilityGoal } from "@/services/types/esgTypes";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SustainabilityGoals from "@/components/goals/SustainabilityGoals";
import ConnectionTester from "@/components/diagnostic/ConnectionTester";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Goals = () => {
  const [activeTab, setActiveTab] = useState("goals");

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Sustainability Goals</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage your organization's sustainability goals and targets
          </p>
        </div>

        <Tabs defaultValue="goals" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="connections">Connection Tester</TabsTrigger>
          </TabsList>
          
          <TabsContent value="goals">
            <SustainabilityGoals />
          </TabsContent>
          
          <TabsContent value="connections">
            <ConnectionTester />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Goals;
