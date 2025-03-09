
import { Download } from 'lucide-react';
import { formatRelativeTime } from '../utils/messageFormatters';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MessageActionsProps {
  content: string;
  timestamp: Date;
  sender: 'user' | 'ai';
}

const MessageActions = ({ content, timestamp, sender }: MessageActionsProps) => {
  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waly-response-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex justify-between items-center mt-4">
      <div
        className={cn(
          "text-xs opacity-70",
          sender === 'user'
            ? "text-white/80"
            : "text-muted-foreground"
        )}
      >
        {formatRelativeTime(timestamp)}
      </div>
      
      {sender === 'ai' && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-xs text-primary hover:text-primary/80 hover:bg-primary/5"
          onClick={handleDownload}
        >
          <Download className="h-3.5 w-3.5 mr-1" />
          Save
        </Button>
      )}
    </div>
  );
};

export default MessageActions;
