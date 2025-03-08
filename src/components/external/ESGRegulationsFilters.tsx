
import { useState } from "react";
import { Tag, Activity, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RegulationImpactLevel } from "./ESGRegulationItem";

export interface RegulationFilters {
  tags: string[];
  impactLevel?: RegulationImpactLevel;
}

const impactLevelOptions: { value: RegulationImpactLevel; label: string }[] = [
  { value: "high", label: "High Impact" },
  { value: "medium", label: "Medium Impact" },
  { value: "low", label: "Low Impact" },
];

interface ESGRegulationsFiltersProps {
  filters: RegulationFilters;
  onFilterChange: (filters: RegulationFilters) => void;
  availableTags: string[];
  onClearFilters: () => void;
}

const ESGRegulationsFilters = ({ 
  filters, 
  onFilterChange, 
  availableTags, 
  onClearFilters 
}: ESGRegulationsFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    
    onFilterChange({ ...filters, tags: newTags });
  };
  
  const handleImpactLevelChange = (value: RegulationImpactLevel | undefined) => {
    onFilterChange({ ...filters, impactLevel: value });
  };
  
  const filteredTags = searchTerm 
    ? availableTags.filter(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    : availableTags;
  
  const hasActiveFilters = filters.tags.length > 0 || filters.impactLevel !== undefined;
  
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {/* Tags filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Tag className="h-3.5 w-3.5 mr-2" />
            Tags
            {filters.tags.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1">
                {filters.tags.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>Filter by Tags</DropdownMenuLabel>
          <div className="px-2 py-2">
            <input
              type="text"
              placeholder="Search tags..."
              className="w-full px-2 py-1 text-sm border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="max-h-64 overflow-y-auto">
            {filteredTags.length === 0 ? (
              <div className="px-2 py-1 text-sm text-muted-foreground">No tags found</div>
            ) : (
              filteredTags.map((tag) => (
                <DropdownMenuItem key={tag} className="flex items-center space-x-2" onSelect={(e) => e.preventDefault()}>
                  <Checkbox 
                    id={`tag-${tag}`} 
                    checked={filters.tags.includes(tag)}
                    onCheckedChange={() => handleTagToggle(tag)}
                  />
                  <label
                    htmlFor={`tag-${tag}`}
                    className="flex-1 text-sm cursor-pointer"
                  >
                    {tag}
                  </label>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Impact level filter */}
      <Select 
        value={filters.impactLevel} 
        onValueChange={(value) => handleImpactLevelChange(value as RegulationImpactLevel || undefined)}
      >
        <SelectTrigger className="w-[160px] h-8">
          <div className="flex items-center">
            <Activity className="h-3.5 w-3.5 mr-2" />
            <SelectValue placeholder="Impact Level" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Impacts</SelectItem>
          {impactLevelOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Clear filters button */}
      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8"
          onClick={onClearFilters}
        >
          <X className="h-3.5 w-3.5 mr-2" />
          Clear Filters
        </Button>
      )}
      
      {/* Active filters display */}
      <div className="flex flex-wrap gap-1 mt-1">
        {filters.tags.map(tag => (
          <Badge 
            key={tag} 
            variant="secondary"
            className="flex items-center h-6 gap-1"
          >
            {tag}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => handleTagToggle(tag)}
            />
          </Badge>
        ))}
        {filters.impactLevel && (
          <Badge 
            variant="secondary"
            className="flex items-center h-6 gap-1"
          >
            {filters.impactLevel} impact
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => handleImpactLevelChange(undefined)}
            />
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ESGRegulationsFilters;
