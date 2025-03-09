
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIAssistantHeaderProps {
  title: string;
}

const AIAssistantHeader = ({ title }: AIAssistantHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Button variant="outline" className="gap-2">
        <Settings className="h-4 w-4" />
        <span className="hidden md:inline">Configure Assistant</span>
      </Button>
    </div>
  );
};

export default AIAssistantHeader;
