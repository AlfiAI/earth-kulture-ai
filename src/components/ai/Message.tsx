
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
        <div className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
          {content.split('\n').map((line, idx) => {
            const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
            
            if (isBullet) {
              return (
                <div key={idx} className="flex items-start gap-2 my-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <p>{line.replace(/^[*-]\s/, '')}</p>
                </div>
              );
            }
            
            return <p key={idx} className={line.trim() ? "mb-2.5" : "mb-1"}>{line}</p>;
          })}
        </div>
      );
    }
    
    return (
      <div className="space-y-5 text-gray-800 dark:text-gray-200">
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
                  <div className="bg-blue-50/80 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
                    <h1 className="text-lg font-bold text-blue-800 dark:text-blue-300">
                      {headerText}
                    </h1>
                  </div>
                )}
                {headerLevel === 2 && (
                  <h2 className="text-md font-semibold text-primary/90 border-b border-primary/20 pb-2 mb-3">
                    {headerText}
                  </h2>
                )}
                {headerLevel === 3 && (
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {headerText}
                  </h3>
                )}
                
                <div className="mt-3 text-sm leading-relaxed">
                  {sectionContent.split('\n').map((line, lineIdx) => {
                    // Handle bold text (**text**)
                    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    
                    const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
                    
                    if (isBullet) {
                      const bulletContent = line.replace(/^[*-]\s/, '');
                      return (
                        <div key={`${idx}-${lineIdx}`} className="flex items-start gap-2 my-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          <p dangerouslySetInnerHTML={{ __html: bulletContent }} />
                        </div>
                      );
                    }
                    
                    if (line.trim() === '---') {
                      return <hr key={`${idx}-${lineIdx}`} className="my-4 border-gray-200 dark:border-gray-700" />;
                    }
                    
                    return <p key={`${idx}-${lineIdx}`} className="mb-2.5" dangerouslySetInnerHTML={{ __html: line }} />;
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
            <AvatarImage src="/lovable-uploads/db6e9d05-9d19-408f-ac05-996d4d8006fb.png" alt="Waly" className="p-1" />
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
            : "max-w-full w-[calc(100%-5rem)] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
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
