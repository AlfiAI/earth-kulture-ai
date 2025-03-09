
import { useState } from "react";
import { Globe, FileText, Database, RefreshCw, Filter, Download, Search } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import ESGRegulationsList from "@/components/external/ESGRegulationsList";
import ESGRegulationsFilters from "@/components/external/ESGRegulationsFilters";
import ESGBenchmarkCard from "@/components/external/ESGBenchmarkCard";
import ESGPagination from "@/components/external/ESGPagination";

const ExternalData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    region: "all",
    category: "all",
    status: "all"
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger a search
    console.log("Searching for:", searchTerm);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-2xl font-bold">External ESG Data</h1>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden md:inline">Export</span>
            </Button>
            <Button className="gap-2">
              <RefreshCw className="h-4 w-4" />
              <span className="hidden md:inline">Refresh Data</span>
            </Button>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-primary/10 to-muted border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-1">External ESG Data Sources</h2>
                <p className="text-muted-foreground mb-3">
                  Access industry benchmarks, regulatory updates, and market trends
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search regulations, benchmarks, or datasets..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit">Search</Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden md:inline">Filters</span>
          </Button>
        </form>

        <Tabs defaultValue="regulations">
          <TabsList className="mb-4">
            <TabsTrigger value="regulations">
              <FileText className="h-4 w-4 mr-2" />
              Regulations
            </TabsTrigger>
            <TabsTrigger value="benchmarks">
              <Database className="h-4 w-4 mr-2" />
              Industry Benchmarks
            </TabsTrigger>
            <TabsTrigger value="datasets">
              <Globe className="h-4 w-4 mr-2" />
              Public Datasets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="regulations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <ESGRegulationsFilters 
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                />
              </div>
              <div className="md:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>ESG Regulations & Frameworks</CardTitle>
                    <CardDescription>Latest regulatory updates and compliance frameworks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ESGRegulationsList filters={activeFilters} search={searchTerm} />
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="text-sm text-muted-foreground">Showing 1-10 of 42 regulations</div>
                    <ESGPagination totalPages={5} currentPage={1} />
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="benchmarks" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Technology Sector ESG Performance",
                  metrics: {
                    environmental: 72,
                    social: 68,
                    governance: 81
                  },
                  companies: 145,
                  updated: "2025-01-15"
                },
                {
                  title: "Manufacturing Industry Carbon Metrics",
                  metrics: {
                    environmental: 65,
                    social: 70,
                    governance: 75
                  },
                  companies: 212,
                  updated: "2025-02-03"
                },
                {
                  title: "Financial Services Governance Standards",
                  metrics: {
                    environmental: 61,
                    social: 73,
                    governance: 85
                  },
                  companies: 178,
                  updated: "2025-01-28"
                },
                {
                  title: "Healthcare Social Responsibility Metrics",
                  metrics: {
                    environmental: 68,
                    social: 81,
                    governance: 77
                  },
                  companies: 98,
                  updated: "2025-02-10"
                },
                {
                  title: "Energy Sector Transition Benchmark",
                  metrics: {
                    environmental: 59,
                    social: 65,
                    governance: 72
                  },
                  companies: 87,
                  updated: "2025-01-20"
                },
                {
                  title: "Retail Industry Supply Chain Ethics",
                  metrics: {
                    environmental: 64,
                    social: 76,
                    governance: 70
                  },
                  companies: 156,
                  updated: "2025-02-05"
                }
              ].map((benchmark, index) => (
                <ESGBenchmarkCard key={index} benchmark={benchmark} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="datasets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Public ESG Datasets</CardTitle>
                <CardDescription>Authoritative datasets from governmental and research organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Global Carbon Project Data",
                      source: "Global Carbon Project",
                      description: "Annual updates on global carbon dioxide emissions and carbon budget allocation.",
                      format: "CSV, Excel",
                      lastUpdated: "2025-01-10"
                    },
                    {
                      title: "Corporate Governance Indicators",
                      source: "World Economic Forum",
                      description: "Global dataset on corporate governance practices across major stock indices.",
                      format: "JSON, CSV",
                      lastUpdated: "2024-12-15"
                    },
                    {
                      title: "EU Emissions Trading System Data",
                      source: "European Commission",
                      description: "Verified emissions, allocations and compliance data for EU ETS operators.",
                      format: "Excel, CSV",
                      lastUpdated: "2025-02-01"
                    },
                    {
                      title: "Global Sustainability Standards Compliance",
                      source: "International Standards Organization",
                      description: "Data on compliance rates with key sustainability standards by country and sector.",
                      format: "CSV, API",
                      lastUpdated: "2025-01-22"
                    }
                  ].map((dataset, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{dataset.title}</h3>
                          <p className="text-sm text-muted-foreground">Source: {dataset.source}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      <p className="mt-2 text-sm">{dataset.description}</p>
                      <div className="mt-2 flex gap-4">
                        <div className="text-xs text-muted-foreground">Format: {dataset.format}</div>
                        <div className="text-xs text-muted-foreground">Updated: {dataset.lastUpdated}</div>
                      </div>
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

export default ExternalData;
