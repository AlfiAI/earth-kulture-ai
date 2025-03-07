
import { Download, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DataSourceListProps } from './types';

const DataSourceList = ({ sources, onAutoProcess }: DataSourceListProps) => {
  return (
    <div className="space-y-3">
      {sources.length > 0 ? (
        sources.map((source) => (
          <div key={source.id} className="border rounded-md p-3">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-medium flex items-center">
                  <FileSpreadsheet className="h-4 w-4 mr-2 text-muted-foreground" />
                  {source.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Last updated: {source.lastUpdated} • {source.recordCount} records
                </p>
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                source.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {source.status === 'active' ? 'Active' : 'Needs Update'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs"
                onClick={() => onAutoProcess(source.id)}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Auto-Process
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No data sources found</p>
        </div>
      )}
    </div>
  );
};

export default DataSourceList;
