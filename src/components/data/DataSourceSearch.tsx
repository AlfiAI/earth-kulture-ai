
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Filter, RefreshCw } from "lucide-react";

interface DataSourceSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const DataSourceSearch = ({ searchQuery, setSearchQuery }: DataSourceSearchProps) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <div className="flex-1">
        <Label htmlFor="search-data" className="sr-only">Search</Label>
        <Input
          id="search-data"
          placeholder="Search data sources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button variant="outline" size="sm">
        <Filter className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm">
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DataSourceSearch;
