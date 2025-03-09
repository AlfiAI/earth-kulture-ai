
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ExternalDataHeader = () => {
  return (
    <>
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
    </>
  );
};

export default ExternalDataHeader;
