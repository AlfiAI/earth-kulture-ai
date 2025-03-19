
import { Supplier } from "./types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building, MapPin, AlertTriangle, CheckCircle } from "lucide-react";

interface SupplierListProps {
  suppliers: Supplier[];
  isLoading: boolean;
}

const SupplierList = ({ suppliers, isLoading }: SupplierListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-12" />
        ))}
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No suppliers found. Try adjusting your search criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Sustainability Score</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  {supplier.name}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  {supplier.location}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={supplier.tier === "tier1" ? "default" : "secondary"}>
                  {supplier.tier === "tier1" ? "Tier 1" : supplier.tier === "tier2" ? "Tier 2" : "Other"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={
                  supplier.sustainabilityScore >= 80 ? "success" : 
                  supplier.sustainabilityScore >= 50 ? "warning" : "destructive"
                }>
                  {supplier.sustainabilityScore}%
                </Badge>
              </TableCell>
              <TableCell>
                {supplier.verified ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Verified
                  </div>
                ) : (
                  <div className="flex items-center text-amber-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Pending
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SupplierList;
