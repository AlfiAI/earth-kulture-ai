
import { MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ConversationStarterDropdownProps {
  starters: string[];
  onStarterClick: (text: string) => void;
  isMobile: boolean;
}

const ConversationStarterDropdown = ({ 
  starters, 
  onStarterClick,
  isMobile 
}: ConversationStarterDropdownProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="absolute mb-2 z-[9999] bottom-[4.5rem] right-0"
    >
      <Card className="p-1.5 bg-white/95 backdrop-blur-sm border border-primary/10 shadow-lg rounded-xl w-[280px]">
        <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
          Quick prompts:
        </div>
        <div className="space-y-1">
          {starters.map((starter, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs rounded-lg p-2 h-auto ai-starter"
              onClick={() => onStarterClick(starter)}
            >
              <MessageSquare className="h-3 w-3 mr-2 text-primary" />
              <span className="truncate">{starter}</span>
            </Button>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default ConversationStarterDropdown;
