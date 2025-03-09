
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// Mock data for datasets
const datasets = [
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
];

const DatasetsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Public ESG Datasets</CardTitle>
        <CardDescription>Authoritative datasets from governmental and research organizations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {datasets.map((dataset, index) => (
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
  );
};

export default DatasetsTab;
