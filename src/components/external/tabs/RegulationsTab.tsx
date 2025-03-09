
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ESGRegulationsList from "@/components/external/ESGRegulationsList";
import ESGRegulationsFilters from "@/components/external/ESGRegulationsFilters";
import ESGPagination from "@/components/external/ESGPagination";
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
        <Card>
          <CardHeader>
            <CardTitle>ESG Regulations & Frameworks</CardTitle>
            <CardDescription>Latest regulatory updates and compliance frameworks</CardDescription>
          </CardHeader>
          <CardContent>
            <ESGRegulationsList />
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <div className="text-sm text-muted-foreground">Showing 1-10 of 42 regulations</div>
            <ESGPagination totalPages={5} page={1} onPageChange={() => {}} />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegulationsTab;
