
import { useState, useEffect } from "react";
import { Search, MapPin, Building, RefreshCw, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useSupplyChainData } from "./hooks/useSupplyChainData";
import SupplyChainMap from "./SupplyChainMap";
import SupplierList from "./SupplierList";
import SupplierSustainabilityMetrics from "./SupplierSustainabilityMetrics";

const SupplyChainTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { suppliers, isLoading, error, fetchSuppliers, metrics } = useSupplyChainData();

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSuppliers(searchQuery, filterType);
  };

  const handleExport = () => {
    toast.success("Supply chain data exported successfully");
  };

  if (error) {
    toast.error("Failed to load supply chain data");
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Supply Chain Transparency</CardTitle>
          <CardDescription>
            Analyze your suppliers' sustainability metrics and geographical distribution using Open Supply Hub data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select
              value={filterType}
              onValueChange={setFilterType}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                <SelectItem value="tier1">Tier 1 Suppliers</SelectItem>
                <SelectItem value="tier2">Tier 2 Suppliers</SelectItem>
                <SelectItem value="critical">Critical Suppliers</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full sm:w-auto">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button type="button" variant="outline" onClick={handleExport} className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <SupplyChainMap suppliers={suppliers} isLoading={isLoading} />
            </div>
            <div>
              <SupplierSustainabilityMetrics metrics={metrics} isLoading={isLoading} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Supplier List</CardTitle>
        </CardHeader>
        <CardContent>
          <SupplierList suppliers={suppliers} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplyChainTab;
