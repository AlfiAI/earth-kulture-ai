
import { useEffect } from "react";
import ESGRegulationsFilters from "@/components/external/ESGRegulationsFilters";
import RegulationsList from "@/components/external/RegulationsList";
import { useExternalData } from "@/hooks/use-external-data";

const RegulationsTab = () => {
  const { 
    filters, 
    handleFilterChange, 
    clearFilters,
    isLoading,
    fetchData
  } = useExternalData();

  // Fetch regulations data on component mount
  useEffect(() => {
    fetchData('regulations');
  }, [fetchData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-1">
        <ESGRegulationsFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          availableTags={[]}
          onClearFilters={clearFilters}
        />
      </div>
      <div className="md:col-span-3">
        <RegulationsList isLoading={isLoading} />
      </div>
    </div>
  );
};

export default RegulationsTab;
