
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import MessageAvatar from './message-parts/MessageAvatar';
import MessageActions from './message-parts/MessageActions';
import FormattedContent from './message-parts/FormattedContent';

export interface MessageProps {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const Message = ({ content, sender, timestamp, id }: MessageProps) => {
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
      {sender === 'ai' && <MessageAvatar sender="ai" />}
      
      <div
        className={cn(
          "rounded-2xl p-5 text-sm shadow-lg",
          sender === 'user'
            ? "max-w-[75%] bg-gradient-to-br from-primary to-sky-500 text-white"
            : "max-w-full w-[calc(100%-5rem)] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
        )}
      >
        <FormattedContent content={content} sender={sender} />
        <MessageActions content={content} timestamp={timestamp} sender={sender} />
      </div>
      
      {sender === 'user' && <MessageAvatar sender="user" />}
    </motion.div>
  );
};

export default Message;
