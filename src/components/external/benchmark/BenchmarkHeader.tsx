
import { Award } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";

interface BenchmarkHeaderProps {
  title: string;
  description: string;
}

const BenchmarkHeader = ({ title, description }: BenchmarkHeaderProps) => {
  return (
    <div>
      <div className="flex items-center mb-2">
        <Award className="h-5 w-5 mr-2 text-primary" />
        <CardTitle className="text-xl">{title}</CardTitle>
      </div>
      <CardDescription>{description}</CardDescription>
    </div>
  );
};

export default BenchmarkHeader;
