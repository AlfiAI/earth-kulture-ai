
import { forwardRef } from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ChatPanelContainerProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const ChatPanelContainer = forwardRef<HTMLDivElement, ChatPanelContainerProps>(
  ({ isOpen, children }, ref) => {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.4
            }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full max-w-[1000px] mx-auto flex flex-col"
            >
              <Card
                ref={ref}
                className={cn(
                  "h-full w-full overflow-hidden transition-all duration-300 ease-in-out",
                  "bg-card/95 backdrop-blur-sm border-primary/10 shadow-xl"
                )}
              >
                {children}
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

ChatPanelContainer.displayName = 'ChatPanelContainer';

export default ChatPanelContainer;
