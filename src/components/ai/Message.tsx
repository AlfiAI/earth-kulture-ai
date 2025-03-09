
import { User } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';

export interface MessageProps {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const Message = ({ content, sender, timestamp }: MessageProps) => {
  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div
      className={cn(
        "flex gap-3 items-start p-3 animate-fade-in",
        sender === 'user' ? "justify-end" : "justify-start"
      )}
    >
      {sender === 'ai' && (
        <Avatar className="h-10 w-10 border-2 border-primary/20 bg-primary/10 shadow-sm">
          <AvatarImage src="/lovable-uploads/664bce6b-c58c-464b-b306-64594271cbdc.png" alt="Waly" className="p-1" />
          <AvatarFallback className="bg-gradient-to-br from-primary to-sky-500 text-white">
            W
          </AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={cn(
          "max-w-[85%] rounded-2xl p-4 text-sm shadow-sm",
          sender === 'user'
            ? "bg-gradient-to-br from-primary to-sky-500 text-white"
            : "bg-gradient-to-br from-gray-50 to-white border border-gray-100 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700"
        )}
      >
        <div className="whitespace-pre-wrap">{content}</div>
        
        <div
          className={cn(
            "text-xs mt-2 opacity-70",
            sender === 'user'
              ? "text-white/80 text-right"
              : "text-muted-foreground"
          )}
        >
          {formatTime(timestamp)}
        </div>
      </div>
      
      {sender === 'user' && (
        <Avatar className="h-10 w-10 border-2 border-primary/20 bg-primary/10 shadow-sm">
          <AvatarFallback className="bg-gradient-to-br from-sky-500 to-primary text-white">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default Message;
