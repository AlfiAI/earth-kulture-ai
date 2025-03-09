
import { X, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatHeaderProps {
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

const ChatHeader = ({ onClose, title, subtitle }: ChatHeaderProps) => {
  const isMobile = useIsMobile();
  const displayTitle = title || (isMobile ? "Waly" : "Waly Assistant");

  return (
    <div className="bg-gradient-to-r from-primary to-sky-500 text-white p-4 flex items-center justify-between rounded-t-2xl">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 bg-white/20 border-2 border-white/30 ring-2 ring-white/10 shadow-lg animate-float">
          <AvatarImage src="/lovable-uploads/664bce6b-c58c-464b-b306-64594271cbdc.png" alt="Waly" className="p-1" />
          <AvatarFallback className="bg-gradient-to-br from-white/90 to-white/70 text-primary">
            <Sparkles className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h2 className="font-medium text-xl">{displayTitle}</h2>
          {subtitle && <p className="text-xs text-white/80">{subtitle}</p>}
        </div>
        <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/20 shadow-sm animate-pulse-gentle">Beta</Badge>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 text-white hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-105"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </Button>
    </div>
  );
};

export default ChatHeader;
