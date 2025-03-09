import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart, TrendingUp } from "lucide-react";

interface AIBenchmarkReportCardProps {
  dashboardView: 'personal' | 'team' | 'organization';
}

const AIBenchmarkReportCard: React.FC<AIBenchmarkReportCardProps> = ({ dashboardView }) => {
  const getReportTitle = () => {
    switch (dashboardView) {
      case 'personal':
        return 'Your ESG Performance Report';
      case 'team':
        return 'Team ESG Performance Report';
      case 'organization':
        return 'Organization-wide ESG Report';
      default:
        return 'ESG Performance Report';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{getReportTitle()}</CardTitle>
          <Badge variant="outline" className="ml-2">AI-Generated</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary">
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-md">
                <h4 className="font-medium mb-1">Key Findings</h4>
                <ul className="text-sm space-y-1">
                  <li className="flex items-start">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>Your carbon reduction rate is 15% better than industry average</span>
                  </li>
                  <li className="flex items-start">
                    <BarChart className="h-4 w-4 mr-2 text-amber-500 mt-0.5" />
                    <span>Water usage efficiency is 8% below benchmark targets</span>
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>Social impact score in top quartile for your sector</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Recommendations</h4>
                <ul className="text-sm space-y-1">
                  <li>• Implement water recycling system to improve efficiency</li>
                  <li>• Expand renewable energy usage by 20% to meet 2025 targets</li>
                  <li>• Enhance supplier ESG screening to reduce Scope 3 emissions</li>
                </ul>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Download Report</span>
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Performance Metrics</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-muted p-2 rounded-md">
                    <div className="text-muted-foreground">Carbon Intensity</div>
                    <div className="font-medium">32.5 tCO2e/$M</div>
                    <div className="text-xs text-green-500">-12% YoY</div>
                  </div>
                  <div className="bg-muted p-2 rounded-md">
                    <div className="text-muted-foreground">Energy Efficiency</div>
                    <div className="font-medium">4.2 kWh/sqft</div>
                    <div className="text-xs text-green-500">-8% YoY</div>
                  </div>
                  <div className="bg-muted p-2 rounded-md">
                    <div className="text-muted-foreground">Water Usage</div>
                    <div className="font-medium">2.8 gal/employee</div>
                    <div className="text-xs text-amber-500">+2% YoY</div>
                  </div>
                  <div className="bg-muted p-2 rounded-md">
                    <div className="text-muted-foreground">Waste Diversion</div>
                    <div className="font-medium">78%</div>
                    <div className="text-xs text-green-500">+5% YoY</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Compliance Status</h4>
                <div className="text-sm">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span>GHG Protocol: Compliant</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span>SASB Standards: Compliant</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                    <span>TCFD Reporting: Partial Compliance</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Full Report</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIBenchmarkReportCard;
