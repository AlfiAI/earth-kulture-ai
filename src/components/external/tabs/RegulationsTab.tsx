
import { useState } from "react";
import ESGRegulationsFilters from "@/components/external/ESGRegulationsFilters";
import RegulationsList from "@/components/external/RegulationsList";
import { RegulationFilters } from "@/components/external/ESGRegulationsFilters";

const RegulationsTab = () => {
  const [activeFilters, setActiveFilters] = useState<RegulationFilters>({
    tags: [],
    impactLevel: undefined
  });

  const handleFilterChange = (filters: RegulationFilters) => {
    setActiveFilters(filters);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-1">
        <ESGRegulationsFilters
          filters={activeFilters}
          onFilterChange={handleFilterChange}
          availableTags={[]}
          onClearFilters={() => setActiveFilters({ tags: [], impactLevel: undefined })}
        />
      </div>
      <div className="md:col-span-3">
        <RegulationsList />
      </div>
    </div>
  );
};

export default RegulationsTab;
