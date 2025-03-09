
import { User, Download } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
    
    if (sections.length <= 1) {
      // If no headers found, just return the content with proper paragraph formatting
      return (
        <div className="whitespace-pre-wrap">
          {content.split('\n').map((line, idx) => {
            const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
            
            if (isBullet) {
              return (
                <div key={idx} className="flex items-start gap-2 my-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  <p>{line.replace(/^[*-]\s/, '')}</p>
                </div>
              );
            }
            
            return <p key={idx} className={line.trim() ? "mb-2" : "mb-1"}>{line}</p>;
          })}
        </div>
      );
    }
    
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
                    const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
                    
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
            <div key={idx} className="leading-relaxed whitespace-pre-wrap">
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
        "flex gap-3 items-start p-4",
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
            <AvatarImage src="/lovable-uploads/f6c4395f-ff31-485c-b1bb-af97a26dd5e5.png" alt="Waly" className="p-1" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-sky-500 text-white">
              W
            </AvatarFallback>
          </Avatar>
        </motion.div>
      )}
      
      <div
        className={cn(
          "rounded-2xl p-5 text-sm shadow-lg",
          sender === 'user'
            ? "max-w-[75%] bg-gradient-to-br from-primary to-sky-500 text-white"
            : "max-w-[85%] sm:max-w-[75%] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
        )}
      >
        <div className={cn(
          sender === 'ai' 
            ? "prose prose-sm dark:prose-invert max-w-none"
            : "whitespace-pre-wrap"
        )}>
          {sender === 'ai' ? formatDocumentContent(content) : content}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div
            className={cn(
              "text-xs opacity-70",
              sender === 'user'
                ? "text-white/80"
                : "text-muted-foreground"
            )}
          >
            {formatTime(timestamp)}
          </div>
          
          {sender === 'ai' && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-xs text-primary hover:text-primary/80 hover:bg-primary/5"
              onClick={() => {
                const blob = new Blob([content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `waly-response-${new Date().toISOString().slice(0, 10)}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Save
            </Button>
          )}
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
