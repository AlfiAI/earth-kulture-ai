
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SustainabilityGoal } from "@/services/types/esgTypes";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SustainabilityGoals from "@/components/goals/SustainabilityGoals";

const Goals = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Sustainability Goals</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage your organization's sustainability goals and targets
          </p>
        </div>

        <SustainabilityGoals />
      </div>
    </DashboardLayout>
  );
};

export default Goals;
