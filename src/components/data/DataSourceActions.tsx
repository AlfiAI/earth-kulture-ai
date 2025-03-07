
import { Upload, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataSourceActionsProps {
  onUpload: () => void;
  onConnect: () => void;
}

const DataSourceActions = ({ onUpload, onConnect }: DataSourceActionsProps) => {
  return (
    <div className="mt-4 pt-4 border-t flex justify-between">
      <Button variant="outline" onClick={onUpload}>
        <Upload className="h-4 w-4 mr-2" />
        Upload Data
      </Button>
      <Button onClick={onConnect}>
        <Database className="h-4 w-4 mr-2" />
        Connect Data Source
      </Button>
    </div>
  );
};

export default DataSourceActions;
