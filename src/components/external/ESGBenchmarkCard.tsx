
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

// Sample benchmark data
const benchmarkData = [
  { year: 2019, company: 40, industry: 70, topPerformer: 30 },
  { year: 2020, company: 35, industry: 65, topPerformer: 25 },
  { year: 2021, company: 30, industry: 60, topPerformer: 20 },
  { year: 2022, company: 25, industry: 55, topPerformer: 18 },
  { year: 2023, company: 20, industry: 50, topPerformer: 15 },
];

const ESGBenchmarkCard = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center mb-2">
          <Award className="h-5 w-5 mr-2 text-primary" />
          <CardTitle className="text-xl">Carbon Intensity Benchmarks</CardTitle>
        </div>
        <CardDescription>
          Compare your carbon intensity to industry averages (tCO2e/$M revenue)
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={benchmarkData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 25,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="company"
                name="Your Company"
                stroke="#10b981"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="industry" 
                name="Industry Average" 
                stroke="#6366f1" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="topPerformer" 
                name="Top Performer" 
                stroke="#f59e0b" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Source: Industry reports, 2023</span>
            <span>Unit: tCO2e/$M revenue</span>
          </div>
          
          <p className="mt-2">
            Your company is <span className="font-semibold text-green-600">60% better</span> 
            than the industry average for carbon intensity.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ESGBenchmarkCard;
