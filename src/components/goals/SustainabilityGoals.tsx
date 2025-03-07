
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SustainabilityGoal } from "@/services/types/esgTypes";
import { PlusCircle, Target, CheckCircle, AlertTriangle, Clock } from "lucide-react";

const SustainabilityGoals = () => {
  const [goals, setGoals] = useState<SustainabilityGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch goals data
    const fetchGoals = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Sample data
        const sampleGoals: SustainabilityGoal[] = [
          {
            id: "1",
            name: "Reduce Carbon Emissions",
            category: "carbon",
            targetValue: 500,
            currentValue: 350,
            unit: "tons CO2e",
            deadline: "2025-12-31",
            startDate: "2023-01-01",
            progress: 70,
            status: "on-track",
            actionPlan: "Implement energy efficiency measures across operations"
          },
          {
            id: "2",
            name: "Increase Renewable Energy",
            category: "energy",
            targetValue: 80,
            currentValue: 45,
            unit: "%",
            deadline: "2026-06-30",
            startDate: "2023-01-01",
            progress: 56,
            status: "on-track",
            actionPlan: "Install solar panels and purchase renewable energy credits"
          },
          {
            id: "3",
            name: "Reduce Water Usage",
            category: "water",
            targetValue: 20000,
            currentValue: 18000,
            unit: "gallons",
            deadline: "2024-12-31",
            startDate: "2022-01-01",
            progress: 30,
            status: "delayed",
            actionPlan: "Implement water recycling systems in manufacturing"
          }
        ];
        
        setGoals(sampleGoals);
      } catch (error) {
        console.error("Error fetching goals:", error);
        toast.error("Failed to load sustainability goals");
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track": return "bg-green-500";
      case "delayed": return "bg-amber-500";
      case "at-risk": return "bg-red-500";
      case "behind": return "bg-red-500";
      case "completed": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on-track": return <CheckCircle className="h-4 w-4" />;
      case "delayed": return <Clock className="h-4 w-4" />;
      case "at-risk": return <AlertTriangle className="h-4 w-4" />;
      case "behind": return <AlertTriangle className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Goals</h2>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Add Goal</span>
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-full mt-4"></div>
                <div className="h-2 bg-muted rounded w-full mt-4"></div>
                <div className="h-6 bg-muted rounded w-1/4 mt-4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{goal.name}</CardTitle>
                  <Badge 
                    className="flex items-center gap-1" 
                    variant={goal.status === "on-track" ? "outline" : "secondary"}
                  >
                    {getStatusIcon(goal.status)}
                    <span>{goal.status.replace('-', ' ')}</span>
                  </Badge>
                </div>
                <CardDescription>Target: {goal.targetValue} {goal.unit}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current: {goal.currentValue} {goal.unit}</span>
                    <span className="text-muted-foreground">Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="pt-2 border-t text-sm text-muted-foreground">
                    <p className="line-clamp-2">{goal.actionPlan}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SustainabilityGoals;
