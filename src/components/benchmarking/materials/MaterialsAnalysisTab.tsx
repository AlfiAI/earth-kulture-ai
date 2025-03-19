
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, Bookmark, ChevronDown, Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useMaterialsData } from "./hooks/useMaterialsData";
import MaterialCard from "./MaterialCard";
import MaterialDetailView from "./MaterialDetailView";
import MaterialComparisonView from "./MaterialComparisonView";

const MaterialsAnalysisTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [materialsToCompare, setMaterialsToCompare] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    recyclable: false,
    lowCarbon: false,
    biodegradable: false,
    certificated: false
  });
  
  const { 
    materials,
    isLoading, 
    searchMaterials,
    getComparisonData
  } = useMaterialsData();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchMaterials(searchQuery, filters);
  };

  const toggleFilter = (filter: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const toggleMaterialForComparison = (id: string) => {
    if (materialsToCompare.includes(id)) {
      setMaterialsToCompare(prev => prev.filter(item => item !== id));
    } else {
      if (materialsToCompare.length < 3) {
        setMaterialsToCompare(prev => [...prev, id]);
      }
    }
  };

  const selectedMaterial = materials.find(m => m.id === selectedMaterialId);
  const comparisonData = getComparisonData(materialsToCompare);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Materials Sustainability Analysis</CardTitle>
          <CardDescription>
            Evaluate and compare the environmental impact of materials used in your operations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search materials, products, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" type="button" className="w-full sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Material Properties</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="recyclable" 
                        checked={filters.recyclable}
                        onCheckedChange={() => toggleFilter('recyclable')}
                      />
                      <Label htmlFor="recyclable">Recyclable</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="lowCarbon" 
                        checked={filters.lowCarbon}
                        onCheckedChange={() => toggleFilter('lowCarbon')}
                      />
                      <Label htmlFor="lowCarbon">Low Carbon Footprint</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="biodegradable" 
                        checked={filters.biodegradable}
                        onCheckedChange={() => toggleFilter('biodegradable')}
                      />
                      <Label htmlFor="biodegradable">Biodegradable</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="certificated" 
                        checked={filters.certificated}
                        onCheckedChange={() => toggleFilter('certificated')}
                      />
                      <Label htmlFor="certificated">Certified Sustainable</Label>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button type="submit" className="w-full sm:w-auto">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            
            <Button 
              type="button" 
              variant={compareMode ? "default" : "outline"} 
              className="w-full sm:w-auto"
              onClick={() => setCompareMode(!compareMode)}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              {compareMode ? "Exit Compare" : "Compare"}
            </Button>
          </form>

          {compareMode && (
            <Card className="mb-4 bg-muted/20">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Select up to 3 materials to compare their sustainability metrics
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {materialsToCompare.length}/3 selected
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {compareMode && materialsToCompare.length > 1 ? (
            <MaterialComparisonView 
              materialIds={materialsToCompare}
              materials={materials}
              onDownload={() => {/* Download functionality */}}
            />
          ) : selectedMaterial ? (
            <MaterialDetailView 
              material={selectedMaterial}
              onBack={() => setSelectedMaterialId(null)}
              onDownload={() => {/* Download functionality */}}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                // Loading state
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-48 bg-muted/20 rounded-md animate-pulse" />
                ))
              ) : materials.length > 0 ? (
                // Materials list
                materials.map((material) => (
                  <MaterialCard 
                    key={material.id}
                    material={material}
                    onClick={() => setSelectedMaterialId(material.id)}
                    onToggleCompare={() => toggleMaterialForComparison(material.id)}
                    compareMode={compareMode}
                    isSelected={materialsToCompare.includes(material.id)}
                  />
                ))
              ) : (
                // Empty state
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">
                    No materials found. Try adjusting your search or filters.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialsAnalysisTab;
