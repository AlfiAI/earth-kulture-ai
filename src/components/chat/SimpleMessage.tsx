
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface MessageProps {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const SimpleMessage = ({ content, sender }: MessageProps) => {
  return (
    <div className={cn(
      "flex gap-3 items-start p-4",
      sender === 'user' ? "justify-end" : "justify-start"
    )}>
      {sender === 'ai' && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/lovable-uploads/b4c78efa-4485-4d1a-8fa8-7b5337a8bd09.png" alt="AI" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "rounded-lg p-4 max-w-[75%]",
        sender === 'user' 
          ? "bg-primary text-white" 
          : "bg-muted border border-border"
      )}>
        {content}
      </div>
      
      {sender === 'user' && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default SimpleMessage;
