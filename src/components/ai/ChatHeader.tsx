
import { X, Bot } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5" />
        <h2 className="font-medium">{isMobile ? "Waly" : "Waly Assistant"}</h2>
        <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/20">Beta</Badge>
      </div>
      
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
