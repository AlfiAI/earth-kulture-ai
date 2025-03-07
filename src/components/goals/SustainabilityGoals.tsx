
import { useState, useEffect } from 'react';
import { Target, Plus, Loader2, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SustainabilityGoal, benchmarkingService } from '@/services/benchmarkingService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const SustainabilityGoals = () => {
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<SustainabilityGoal[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    category: 'carbon',
    targetValue: 0,
    currentValue: 0,
    unit: '',
    deadline: '',
    startDate: new Date().toISOString().split('T')[0]
  });
  
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const category = selectedCategory === 'all' ? undefined : selectedCategory;
        const data = await benchmarkingService.getSustainabilityGoals(category);
        setGoals(data);
      } catch (error) {
        console.error('Error fetching goals:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGoals();
  }, [selectedCategory]);

  const handleCreateGoal = async () => {
    try {
      if (!newGoal.name || !newGoal.unit || !newGoal.deadline) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      const createdGoal = await benchmarkingService.createSustainabilityGoal(newGoal);
      setGoals(prev => [createdGoal, ...prev]);
      setDialogOpen(false);
      toast.success('Goal created successfully with AI-generated action plan');
      
      // Reset form
      setNewGoal({
        name: '',
        category: 'carbon',
        targetValue: 0,
        currentValue: 0,
        unit: '',
        deadline: '',
        startDate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
    }
  };

  const getStatusIcon = (status: 'on-track' | 'at-risk' | 'behind') => {
    switch (status) {
      case 'on-track':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'at-risk':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'behind':
        return <Clock className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Sustainability Goals
            </CardTitle>
            <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              New Goal
            </Button>
          </div>
          <CardDescription>
            Track progress on your sustainability targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="carbon">Carbon</TabsTrigger>
              <TabsTrigger value="energy">Energy</TabsTrigger>
              <TabsTrigger value="waste">Waste</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedCategory}>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : goals.length > 0 ? (
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{goal.name}</h3>
                        <div className="flex items-center gap-1 text-sm">
                          {getStatusIcon(goal.status)}
                          <span className={`
                            ${goal.status === 'on-track' ? 'text-green-500' : 
                              goal.status === 'at-risk' ? 'text-amber-500' : 'text-red-500'}
                          `}>
                            {goal.status === 'on-track' ? 'On Track' : 
                             goal.status === 'at-risk' ? 'At Risk' : 'Behind'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{goal.currentValue} {goal.unit}</span>
                          <span>{goal.targetValue} {goal.unit}</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Started: {new Date(goal.startDate).toLocaleDateString()}</span>
                        <span>Target: {new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                      
                      {goal.actionPlan && goal.actionPlan.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm font-medium mb-2">AI-Generated Action Plan:</p>
                          <div className="space-y-2">
                            {goal.actionPlan.slice(0, 2).map((step) => (
                              <div key={step.id} className="flex items-start gap-2">
                                <div className={`h-5 w-5 rounded-full flex items-center justify-center mt-0.5
                                  ${step.status === 'complete' ? 'bg-green-100' : 
                                    step.status === 'in-progress' ? 'bg-blue-100' : 'bg-gray-100'}
                                `}>
                                  <span className={`text-xs
                                    ${step.status === 'complete' ? 'text-green-600' : 
                                      step.status === 'in-progress' ? 'text-blue-600' : 'text-gray-600'}
                                  `}>
                                    {step.status === 'complete' ? '✓' : 
                                     step.status === 'in-progress' ? '↻' : '○'}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm">{step.description}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Due: {new Date(step.deadline || '').toLocaleDateString()} • 
                                    Impact: <span className={`
                                      ${step.impact === 'high' ? 'text-green-600' : 
                                        step.impact === 'medium' ? 'text-blue-600' : 'text-gray-600'}
                                    `}>
                                      {step.impact}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            ))}
                            
                            {goal.actionPlan.length > 2 && (
                              <p className="text-xs text-muted-foreground">
                                +{goal.actionPlan.length - 2} more steps
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground p-4">
                  No sustainability goals found
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add New Sustainability Goal
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Sustainability Goal</DialogTitle>
            <DialogDescription>
              Add a new goal and our AI will generate an action plan to help you achieve it.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Goal Name</Label>
              <Input 
                id="name" 
                value={newGoal.name}
                onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                placeholder="e.g., Reduce Carbon Emissions"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newGoal.category}
                  onValueChange={(value) => setNewGoal({...newGoal, category: value})}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carbon">Carbon</SelectItem>
                    <SelectItem value="energy">Energy</SelectItem>
                    <SelectItem value="waste">Waste</SelectItem>
                    <SelectItem value="water">Water</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="governance">Governance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Input 
                  id="unit" 
                  value={newGoal.unit}
                  onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                  placeholder="e.g., tCO2e, kWh, %"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="current">Current Value</Label>
                <Input 
                  id="current" 
                  type="number"
                  value={newGoal.currentValue || ''}
                  onChange={(e) => setNewGoal({...newGoal, currentValue: Number(e.target.value)})}
                />
              </div>
              
              <div>
                <Label htmlFor="target">Target Value</Label>
                <Input 
                  id="target" 
                  type="number"
                  value={newGoal.targetValue || ''}
                  onChange={(e) => setNewGoal({...newGoal, targetValue: Number(e.target.value)})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="deadline">Target Deadline</Label>
              <Input 
                id="deadline" 
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateGoal}>
              Create Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SustainabilityGoals;
