
import { Download, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ComplianceHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Compliance Dashboard</h1>
        <p className="text-muted-foreground">Monitor and manage compliance across frameworks</p>
      </div>
      <div className="flex items-center gap-2 mt-4 sm:mt-0">
        <Button variant="outline" size="sm" className="h-9 gap-1">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
        <Button variant="outline" size="sm" className="h-9 gap-1">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </div>
    </div>
  );
};

export default ComplianceHeader;
