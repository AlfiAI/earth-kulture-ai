
import { Award } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";

interface BenchmarkHeaderProps {
  title: string;
  description?: string;
  data?: any[];
  isLoading?: boolean;
}

const BenchmarkHeader = ({ title, description, data, isLoading }: BenchmarkHeaderProps) => {
  // Generate a dynamic description if one is not provided
  const renderDescription = () => {
    if (description) return description;
    
    if (isLoading) {
      return "Loading benchmark data...";
    }
    
    if (data && data.length > 0) {
      return `Comparing performance across ${data.length} metrics`;
    }
    
    return "Compare your performance against industry standards";
  };

  return (
    <div>
      <div className="flex items-center mb-2">
        <Award className="h-5 w-5 mr-2 text-primary" />
        <CardTitle className="text-xl">{title}</CardTitle>
      </div>
      <CardDescription>{renderDescription()}</CardDescription>
    </div>
  );
};

export default BenchmarkHeader;
