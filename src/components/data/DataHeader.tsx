
import { PlusCircle, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface DataHeaderProps {
  title: string;
  subtitle: string;
}

const DataHeader = ({ title, subtitle }: DataHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2 mt-4 sm:mt-0">
        <Button variant="outline" size="sm" className="h-9 gap-1">
          <Upload className="h-4 w-4" />
          <span>Upload</span>
        </Button>
        <Button size="sm" className="h-9 gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>Connect API</span>
        </Button>
      </div>
    </div>
  );
};

export default DataHeader;
