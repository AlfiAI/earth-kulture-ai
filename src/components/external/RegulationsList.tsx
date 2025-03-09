
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ESGRegulationsList from "@/components/external/ESGRegulationsList";
import ESGPagination from "@/components/external/ESGPagination";

const RegulationsList = () => {
  return (
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
  );
};

export default RegulationsList;
