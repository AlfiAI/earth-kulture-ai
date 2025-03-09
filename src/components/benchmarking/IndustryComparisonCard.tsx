import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { IndustryType } from '@/services/ai/orchestration/types/agentTypes';
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

interface IndustryComparisonCardProps {
  industryContext: IndustryType;
}

const IndustryComparisonCard: React.FC<IndustryComparisonCardProps> = ({ industryContext }) => {
  // Sample data - in a real app, this would come from an API
  const data = [
    {
      name: 'Carbon Emissions',
      'Your Company': 85,
      'Industry Average': 100,
      'Top Performers': 65,
    },
    {
      name: 'Water Usage',
      'Your Company': 70,
      'Industry Average': 80,
      'Top Performers': 50,
    },
    {
      name: 'Waste Recycling',
      'Your Company': 75,
      'Industry Average': 60,
      'Top Performers': 90,
    },
    {
      name: 'Energy Efficiency',
      'Your Company': 80,
      'Industry Average': 70,
      'Top Performers': 95,
    },
  ];

  // Format industry name for display
  const formatIndustryName = (industry: IndustryType): string => {
    return industry.charAt(0).toUpperCase() + industry.slice(1).replace(/_/g, ' ');
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Industry Comparison</CardTitle>
          <Badge variant="outline" className="ml-2">
            {formatIndustryName(industryContext)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4 flex items-center">
          <Info className="h-4 w-4 mr-2" />
          <span>Comparing your performance against industry benchmarks</span>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Your Company" fill="#3b82f6" />
              <Bar dataKey="Industry Average" fill="#6b7280" />
              <Bar dataKey="Top Performers" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-sm">
          <p className="font-medium">Key Insights:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
            <li>Your carbon emissions are 15% below industry average</li>
            <li>Water usage efficiency is better than 65% of peers</li>
            <li>Opportunity to improve waste recycling practices</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndustryComparisonCard;
