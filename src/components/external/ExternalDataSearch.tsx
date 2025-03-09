
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { useExternalData } from "@/hooks/use-external-data";

const ExternalDataSearch = () => {
  const { searchTerm, handleSearch } = useExternalData();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search regulations, benchmarks, or datasets..." 
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <Button type="submit">Search</Button>
      <Button variant="outline" className="gap-2">
        <Filter className="h-4 w-4" />
        <span className="hidden md:inline">Filters</span>
      </Button>
    </form>
  );
};

export default ExternalDataSearch;
