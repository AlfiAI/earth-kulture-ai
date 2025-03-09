
import { User } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { motion } from "framer-motion";

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

  // Function to format content as a document with sections
  const formatDocumentContent = (content: string) => {
    if (sender !== 'ai') return content;

    // Split content by headers (denoted by # or ## style markdown)
    const sections = content.split(/(?=#{1,3}\s)/);
    
    return (
      <div className="space-y-4">
        {sections.map((section, idx) => {
          const isHeader = /^#{1,3}\s/.test(section);
          const headerMatch = section.match(/^(#{1,3})\s(.*?)(?:\n|$)/);
          
          if (headerMatch) {
            const headerLevel = headerMatch[1].length;
            const headerText = headerMatch[2];
            const sectionContent = section.replace(/^#{1,3}\s.*?(?:\n|$)/, '').trim();
            
            return (
              <div key={idx} className="document-section">
                {headerLevel === 1 && (
                  <div className="bg-blue-100/50 dark:bg-blue-900/20 rounded-lg p-2 mb-3">
                    <h1 className="text-lg font-bold text-center">
                      {headerText}
                    </h1>
                  </div>
                )}
                {headerLevel === 2 && (
                  <h2 className="text-md font-semibold text-primary border-b border-primary/20 pb-1 mb-2">
                    {headerText}
                  </h2>
                )}
                {headerLevel === 3 && (
                  <h3 className="text-sm font-medium mb-1">
                    {headerText}
                  </h3>
                )}
                
                <div className="mt-2 text-sm leading-relaxed">
                  {sectionContent.split('\n').map((line, lineIdx) => {
                    const isBullet = line.startsWith('- ') || line.startsWith('* ');
                    
                    if (isBullet) {
                      return (
                        <div key={`${idx}-${lineIdx}`} className="flex items-start gap-2 my-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                          <p>{line.replace(/^[*-]\s/, '')}</p>
                        </div>
                      );
                    }
                    
                    return <p key={`${idx}-${lineIdx}`} className="mb-2">{line}</p>;
                  })}
                </div>
              </div>
            );
          }
          
          return (
            <div key={idx} className="leading-relaxed">
              {section}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-3 items-start p-3",
        sender === 'user' ? "justify-end" : "justify-start"
      )}
    >
      {sender === 'ai' && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <Avatar className="h-12 w-12 border-2 border-primary/20 bg-primary/10 shadow-sm">
            <AvatarImage src="/lovable-uploads/576b2f20-ecd7-4793-bc03-a40c9349e2a1.png" alt="Waly" className="p-1" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-sky-500 text-white">
              W
            </AvatarFallback>
          </Avatar>
        </motion.div>
      )}
      
      <div
        className={cn(
          "max-w-[90%] rounded-2xl p-5 text-sm shadow-lg",
          sender === 'user'
            ? "bg-gradient-to-br from-primary to-sky-500 text-white"
            : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
        )}
      >
        <div className={cn(
          sender === 'ai' 
            ? "prose prose-sm dark:prose-invert max-w-none"
            : "whitespace-pre-wrap"
        )}>
          {sender === 'ai' ? formatDocumentContent(content) : content}
        </div>
        
        <div
          className={cn(
            "text-xs mt-3 opacity-70",
            sender === 'user'
              ? "text-white/80 text-right"
              : "text-muted-foreground"
          )}
        >
          {formatTime(timestamp)}
        </div>
      </div>
      
      {sender === 'user' && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <Avatar className="h-12 w-12 border-2 border-primary/20 bg-primary/10 shadow-sm">
            <AvatarFallback className="bg-gradient-to-br from-sky-500 to-primary text-white">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Message;
