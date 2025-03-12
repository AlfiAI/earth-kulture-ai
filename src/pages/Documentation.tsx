
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Book, Code } from "lucide-react";

const Documentation = () => {
  return (
    <DashboardLayout>
      <div className="px-3 py-4 md:p-6 max-w-7xl mx-auto pb-24 overflow-x-hidden">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Documentation</h1>
        
        <Tabs defaultValue="guides" className="w-full">
          <TabsList className="mb-4 w-full overflow-x-auto flex whitespace-nowrap pb-1">
            <TabsTrigger value="guides" className="flex-shrink-0">
              <Book className="h-4 w-4 mr-2" />
              <span>User Guides</span>
            </TabsTrigger>
            <TabsTrigger value="reference" className="flex-shrink-0">
              <FileText className="h-4 w-4 mr-2" />
              <span>Reference</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex-shrink-0">
              <Code className="h-4 w-4 mr-2" />
              <span>API</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="guides">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Getting Started</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Complete guides on how to get started with EarthKulture AI for your ESG reporting and monitoring.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">ESG Reporting Basics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Learn about ESG reporting fundamentals and how our platform helps streamline your sustainability reporting.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="reference">
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Reference Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Detailed references for all features and functionality available in the platform.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">API Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Learn how to integrate with our API for automated data collection and reporting.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Documentation;
