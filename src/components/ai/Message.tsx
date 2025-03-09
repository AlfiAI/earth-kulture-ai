
import { Bot, User } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
        "flex gap-3 items-start px-4 py-2",
        sender === 'user' ? "justify-end" : "justify-start"
      )}
    >
      {sender === 'ai' && (
        <Avatar className="h-8 w-8 border-2 border-primary/20 bg-primary/10">
          <AvatarFallback className="bg-gradient-to-br from-primary/80 to-sky-500/80 text-white">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={cn(
          "max-w-[85%] rounded-lg p-3 text-sm",
          sender === 'user'
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
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
      
      {sender === 'user' && (
        <Avatar className="h-8 w-8 border-2 border-primary/20 bg-primary/10">
          <AvatarFallback className="bg-gradient-to-br from-sky-500/80 to-primary/80 text-white">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default Message;
