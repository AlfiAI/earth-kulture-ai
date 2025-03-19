
import { useState } from "react";
import { Supplier } from "./types";
import { Skeleton } from "@/components/ui/skeleton";

interface SupplyChainMapProps {
  suppliers: Supplier[];
  isLoading: boolean;
}

const SupplyChainMap = ({ suppliers, isLoading }: SupplyChainMapProps) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  
  if (isLoading) {
    return <Skeleton className="w-full h-[400px] rounded-md" />;
  }

  // Note: In a real implementation, this would use a mapping library like MapBox or Google Maps
  return (
    <div className="border rounded-md p-4 h-[400px] bg-muted/20 flex flex-col items-center justify-center text-center">
      <h3 className="text-lg font-medium mb-2">Supplier Geographical Distribution</h3>
      <p className="text-muted-foreground mb-4">Viewing {suppliers.length} suppliers across {countUniqueRegions(suppliers)} regions</p>
      <div className="text-xs text-muted-foreground">
        Interactive map would display here with supplier locations.
        <br />
        Integration with Open Supply Hub API provides real-time supplier location data.
      </div>
    </div>
  );
};

// Helper function to count unique regions
function countUniqueRegions(suppliers: Supplier[]): number {
  const regions = new Set(suppliers.map(s => s.region));
  return regions.size;
}

export default SupplyChainMap;
