import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, Circle, TrendingUp } from 'lucide-react';
import { esgDataService } from '@/services/esgDataService';
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { benchmarkingService } from '@/services/benchmarkingService';

interface SustainabilityGoal {
  id: string;
  name: string;
  category: 'social' | 'governance' | 'carbon' | 'energy' | 'waste' | 'water';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  startDate: string;
  progress: number;
  status: 'on-track' | 'delayed' | 'completed';
  actionPlan: string;
}

const SustainabilityGoals = () => {
  const [goals, setGoals] = useState<SustainabilityGoal[]>([]);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    category: 'carbon',
    targetValue: 0,
    currentValue: 0,
    unit: 'tCO2e',
    deadline: format(new Date(), 'yyyy-MM-dd'),
    startDate: format(new Date(), 'yyyy-MM-dd'),
  });
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const fetchGoals = async () => {
      const fetchedGoals = await benchmarkingService.getSustainabilityGoals();
      setGoals(fetchedGoals);
    };

    fetchGoals();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      setNewGoal(prev => ({ ...prev, deadline: format(date, 'yyyy-MM-dd') }));
    }
  };

  const handleCreateGoal = async () => {
    try {
      const categoryValue = newGoal.category as 'carbon' | 'energy' | 'waste' | 'water' | 'social' | 'governance';
      await benchmarkingService.createGoal({
        ...newGoal,
        category: categoryValue
      });
      toast.success('Goal created successfully');
      setShowCreateGoal(false);
      
      // Refresh goals
      const fetchedGoals = await benchmarkingService.getSustainabilityGoals();
      setGoals(fetchedGoals);
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sustainability Goals</h2>
        <Button onClick={() => setShowCreateGoal(true)}>Create New Goal</Button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {goals.map(goal => (
          <Card key={goal.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {goal.name}
                {goal.status === 'completed' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-400" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                <Label>Category</Label>
                <p>{goal.category}</p>
              </div>
              <div className="mb-2">
                <Label>Progress</Label>
                <Progress value={goal.progress} />
                <p className="text-sm text-muted-foreground">{goal.progress}%</p>
              </div>
              <div className="mb-2">
                <Label>Target Value</Label>
                <p>{goal.targetValue} {goal.unit}</p>
              </div>
              <div className="mb-2">
                <Label>Current Value</Label>
                <p>{goal.currentValue} {goal.unit}</p>
              </div>
              <div className="mb-2">
                <Label>Deadline</Label>
                <p>{goal.deadline}</p>
              </div>
              <div>
                <Label>Status</Label>
                <p>{goal.status}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showCreateGoal && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Create New Sustainability Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Goal Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={newGoal.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => handleInputChange({ target: { name: 'category', value } } as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
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
              <div className="grid gap-2">
                <Label htmlFor="targetValue">Target Value</Label>
                <Input
                  type="number"
                  id="targetValue"
                  name="targetValue"
                  value={newGoal.targetValue}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currentValue">Current Value</Label>
                <Input
                  type="number"
                  id="currentValue"
                  name="currentValue"
                  value={newGoal.currentValue}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  type="text"
                  id="unit"
                  name="unit"
                  value={newGoal.unit}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label>Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center" side="bottom">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button onClick={handleCreateGoal}>Create Goal</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SustainabilityGoals;
