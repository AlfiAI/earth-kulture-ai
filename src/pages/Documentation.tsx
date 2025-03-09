
import { Book, FileText, PenTool, Globe, Laptop, Code } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Documentation = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Documentation</h1>
        </div>

        <Card className="bg-gradient-to-r from-primary/10 to-muted border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Book className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-1">ESG Platform Documentation</h2>
                <p className="text-muted-foreground mb-3">
                  Comprehensive guides and resources to help you maximize your ESG performance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="guides">
          <TabsList className="mb-4">
            <TabsTrigger value="guides">
              <FileText className="h-4 w-4 mr-2" />
              User Guides
            </TabsTrigger>
            <TabsTrigger value="technical">
              <Code className="h-4 w-4 mr-2" />
              Technical Docs
            </TabsTrigger>
            <TabsTrigger value="regulations">
              <Globe className="h-4 w-4 mr-2" />
              Regulations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guides" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Essential guides for new users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Platform Overview",
                      description: "Learn about the key features of our ESG platform",
                      icon: <Laptop className="h-5 w-5 text-primary" />
                    },
                    {
                      title: "Data Setup Guide",
                      description: "How to configure your ESG data sources",
                      icon: <PenTool className="h-5 w-5 text-primary" />
                    },
                    {
                      title: "Reporting Basics",
                      description: "Creating your first ESG reports",
                      icon: <FileText className="h-5 w-5 text-primary" />
                    }
                  ].map((item, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          {item.icon}
                          <CardTitle className="text-base">{item.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advanced Guides</CardTitle>
                <CardDescription>Detailed tutorials for experienced users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      title: "AI-Powered Analysis",
                      description: "Leveraging AI to gain deeper insights",
                      icon: <Laptop className="h-5 w-5 text-primary" />
                    },
                    {
                      title: "Custom Benchmarking",
                      description: "Setting up industry-specific benchmarks",
                      icon: <PenTool className="h-5 w-5 text-primary" />
                    },
                    {
                      title: "Integration Options",
                      description: "Connecting with external data sources",
                      icon: <Globe className="h-5 w-5 text-primary" />
                    }
                  ].map((item, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          {item.icon}
                          <CardTitle className="text-base">{item.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>Technical resources for developers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Comprehensive API documentation to help you integrate with our platform.
                </p>
                <div className="bg-muted p-4 rounded-md">
                  <code className="text-sm">
                    <pre>
                      {`GET /api/v1/esg/metrics
Authorization: Bearer {your_api_key}

Response:
{
  "metrics": [
    {
      "id": "carbon_emissions",
      "name": "Carbon Emissions",
      "unit": "tCO2e",
      "value": 120.5
    },
    ...
  ]
}`}
                    </pre>
                  </code>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regulations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Regulatory Frameworks</CardTitle>
                <CardDescription>Summaries of key ESG regulations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "EU CSRD",
                      description: "Corporate Sustainability Reporting Directive requirements and implementation guidelines",
                    },
                    {
                      title: "TCFD Framework",
                      description: "Task Force on Climate-related Financial Disclosures reporting standards",
                    },
                    {
                      title: "GHG Protocol",
                      description: "Standards for measuring and managing greenhouse gas emissions",
                    },
                  ].map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Documentation;
