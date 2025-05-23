
import DashboardLayout from "@/components/layout/DashboardLayout";
import { FileText, Download, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ReportGenerator from "@/components/reports/ReportGenerator";

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="container max-w-7xl mx-auto p-4 lg:p-6 pb-24">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sustainability Reports</h1>
            <p className="text-muted-foreground">Generate AI-powered ESG and sustainability reports</p>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>
        
        <Card className="p-6 mb-6 bg-gradient-to-r from-primary/10 to-background border-primary/20">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1">AI-Powered Sustainability Reporting</h2>
              <p className="text-muted-foreground mb-3">
                Generate comprehensive, customizable ESG reports using our advanced AI. Select frameworks, focus areas, and date ranges to create tailored sustainability reports.
              </p>
              <Button variant="default" size="sm" className="gap-1">
                <Zap className="h-4 w-4" />
                <span>Ask Waly for Report Recommendations</span>
              </Button>
            </div>
          </div>
        </Card>
        
        <div className="mb-8">
          <ReportGenerator />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
