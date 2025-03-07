
import { Bot } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface MessageProps {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const Message = ({ content, sender, timestamp }: MessageProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={cn(
        "flex",
        sender === 'user' ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-lg p-3 text-sm",
          sender === 'user'
            ? "bg-primary text-primary-foreground ml-4"
            : "bg-muted mr-4 relative"
        )}
      >
        {sender === 'ai' && (
          <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white">
            <Bot className="h-3 w-3" />
          </div>
        )}
        
        {content}
        
        <div
          className={cn(
            "text-xs mt-1",
            sender === 'user'
              ? "text-primary-foreground/70 text-right"
              : "text-muted-foreground"
          )}
        >
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
};

export default Message;
