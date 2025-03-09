
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface ExternalDataSearchProps {
  onSearch: (term: string) => void;
}

const ExternalDataSearch = ({ onSearch }: ExternalDataSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
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
  );
};

export default ExternalDataSearch;
