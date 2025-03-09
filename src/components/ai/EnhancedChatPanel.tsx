
import { useRef, forwardRef, useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import EnhancedChatBanner from './EnhancedChatBanner';
import { useEnhancedChat } from '@/hooks/use-enhanced-chat';
import ConversationStarters from './ConversationStarters';
import { TrendingUp, Zap, Lightbulb, BarChart, LineChart, Shield, Table, FileText } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { dataService } from '@/services/data/dataService';
import { esgDataService } from '@/services/esgDataService';
import { externalDataService } from '@/services/external/externalDataService';
import { useEffect as useReactEffect } from 'react';

interface EnhancedChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  position: { bottom: number; right: number };
  currentPath?: string;
}

const EnhancedChatPanel = forwardRef<HTMLDivElement, EnhancedChatPanelProps>(
  ({ isOpen, onClose, position, currentPath = '/' }, ref) => {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const { messages, inputValue, setInputValue, isTyping, handleSend } = useEnhancedChat();
    const [showNewChat, setShowNewChat] = useState(true);
    const [pageContext, setPageContext] = useState<any>(null);
    
    // Load relevant page context data based on the current path
    useReactEffect(() => {
      const loadPageContext = async () => {
        try {
          let contextData = {};
          
          if (currentPath.includes('analytics')) {
            const esgData = await esgDataService.getAllESGData();
            const emissions = await esgDataService.getCarbonEmissions();
            contextData = {
              type: 'analytics',
              esgData: esgData.slice(0, 5), // Limit data size
              emissions: emissions.slice(0, 5),
              carbonFootprint: esgDataService.calculateCarbonFootprint(emissions)
            };
          } else if (currentPath.includes('benchmark')) {
            const benchmarks = await externalDataService.fetchBenchmarks();
            contextData = {
              type: 'benchmarking',
              benchmarks: benchmarks.slice(0, 3)
            };
          } else if (currentPath.includes('compliance')) {
            const frameworks = await esgDataService.getComplianceFrameworks();
            contextData = {
              type: 'compliance',
              frameworks: frameworks.slice(0, 3)
            };
          } else if (currentPath.includes('about')) {
            contextData = {
              type: 'about',
              platformInfo: {
                name: 'Waly ESG Platform',
                capabilities: [
                  'Advanced ESG analytics',
                  'Carbon footprint tracking',
                  'Regulatory compliance monitoring',
                  'AI-powered insights and recommendations'
                ]
              }
            };
          }
          
          setPageContext(contextData);
        } catch (error) {
          console.error('Error loading page context:', error);
        }
      };
      
      if (isOpen) {
        loadPageContext();
      }
    }, [isOpen, currentPath]);
    
    // Get starters based on current page context
    const getPageContextStarters = () => {
      if (currentPath?.includes('analytics')) {
        return [
          {
            text: "Explain my emissions trend data",
            icon: <LineChart className="h-4 w-4 text-sky-500" />
          },
          {
            text: "Generate ESG performance summary",
            icon: <BarChart className="h-4 w-4 text-emerald-500" />
          },
          {
            text: "Identify areas for improvement",
            icon: <Zap className="h-4 w-4 text-amber-500" />
          },
          {
            text: "Recommend key metrics to track",
            icon: <Table className="h-4 w-4 text-purple-500" />
          }
        ];
      } else if (currentPath?.includes('benchmark')) {
        return [
          {
            text: "Compare me to industry leaders",
            icon: <TrendingUp className="h-4 w-4 text-sky-500" />
          },
          {
            text: "Generate competitive analysis",
            icon: <BarChart className="h-4 w-4 text-emerald-500" />
          },
          {
            text: "Simulate future performance trends",
            icon: <LineChart className="h-4 w-4 text-amber-500" />
          },
          {
            text: "Recommend improvement strategies",
            icon: <Lightbulb className="h-4 w-4 text-purple-500" />
          }
        ];
      } else if (currentPath?.includes('compliance')) {
        return [
          {
            text: "Explain CSRD requirements",
            icon: <Shield className="h-4 w-4 text-sky-500" />
          },
          {
            text: "Summarize upcoming regulations",
            icon: <FileText className="h-4 w-4 text-emerald-500" />
          },
          {
            text: "Assess my compliance gaps",
            icon: <Zap className="h-4 w-4 text-amber-500" />
          },
          {
            text: "Create compliance roadmap",
            icon: <Lightbulb className="h-4 w-4 text-purple-500" />
          }
        ];
      } else {
        // Default starters
        return [
          {
            text: "Analyze my sustainability progress",
            icon: <TrendingUp className="h-4 w-4 text-sky-500" />
          },
          {
            text: "Generate ESG performance forecast",
            icon: <BarChart className="h-4 w-4 text-emerald-500" />
          },
          {
            text: "Identify compliance risk areas",
            icon: <Zap className="h-4 w-4 text-amber-500" />
          },
          {
            text: "Suggest optimization strategies",
            icon: <Lightbulb className="h-4 w-4 text-purple-500" />
          }
        ];
      }
    };
    
    const handleStarterClick = (text: string) => {
      setInputValue(text);
      // Automatically send the message
      setTimeout(() => {
        handleSend();
        setShowNewChat(false);
      }, 100);
    };
    
    const handleNewChat = () => {
      // Reset the chat
      window.location.reload();
    };

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
                <ChatHeader 
                  onClose={onClose} 
                  title="Waly Pro" 
                  subtitle={`Advanced ESG Intelligence${currentPath ? ` • ${currentPath.slice(1).charAt(0).toUpperCase() + currentPath.slice(2)}` : ''}`} 
                />
                
                <CardContent className="p-0 flex flex-col h-[calc(100%-56px)]">
                  <EnhancedChatBanner />
                  
                  {messages.length === 0 && showNewChat && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      <ConversationStarters 
                        starters={getPageContextStarters()} 
                        onStarterClick={handleStarterClick}
                        onNewChat={handleNewChat}
                      />
                    </motion.div>
                  )}
                  
                  {(messages.length > 0 || !showNewChat) && (
                    <MessageList 
                      messages={messages} 
                      isTyping={isTyping} 
                    />
                  )}
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <ChatInput
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      handleSend={handleSend}
                      inputRef={inputRef}
                      placeholder={`Ask about ${currentPath?.includes('analytics') ? 'your ESG metrics and performance' : 
                                   currentPath?.includes('benchmark') ? 'industry benchmarks and competition' :
                                   currentPath?.includes('compliance') ? 'regulations and requirements' :
                                   'sustainability, ESG, and carbon management'}...`}
                    />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

EnhancedChatPanel.displayName = 'EnhancedChatPanel';

export default EnhancedChatPanel;
