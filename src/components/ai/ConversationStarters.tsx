
import { Button } from "@/components/ui/button";
import { Leaf, LineChart, AlertCircle, Award, Sparkles, MessageSquarePlus } from "lucide-react";
import { ReactNode } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface StarterProps {
  text: string;
  icon?: ReactNode;
}

interface ConversationStartersProps {
  starters: StarterProps[];
  onStarterClick: (text: string) => void;
  onNewChat: () => void;
}

const ConversationStarters = ({ starters, onStarterClick, onNewChat }: ConversationStartersProps) => {
  return (
    <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
              <AvatarImage 
                src="/lovable-uploads/664bce6b-c58c-464b-b306-64594271cbdc.png" 
                alt="Waly"
                className="p-2"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-sky-500 text-white">
                W
              </AvatarFallback>
            </Avatar>
          </div>
          <h3 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-sky-500">
            How can I help you today?
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Select a conversation starter or ask anything</p>
        </div>
        
        <div className="grid gap-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3 px-4 text-left hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 rounded-xl group"
            onClick={() => onStarterClick("How can I improve my ESG score?")}
          >
            <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Award className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium">How can I improve my ESG score?</span>
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3 px-4 text-left hover:bg-sky-500/5 hover:border-sky-500/30 transition-all duration-300 rounded-xl group"
            onClick={() => onStarterClick("Explain carbon footprint tracking")}
          >
            <div className="p-1.5 rounded-lg bg-sky-500/10 group-hover:bg-sky-500/20 transition-colors">
              <Leaf className="h-4 w-4 text-sky-500" />
            </div>
            <span className="text-sm font-medium">Explain carbon footprint tracking</span>
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3 px-4 text-left hover:bg-amber-500/5 hover:border-amber-500/30 transition-all duration-300 rounded-xl group"
            onClick={() => onStarterClick("What ESG metrics should I monitor?")}
          >
            <div className="p-1.5 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
              <LineChart className="h-4 w-4 text-amber-500" />
            </div>
            <span className="text-sm font-medium">What ESG metrics should I monitor?</span>
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3 px-4 text-left hover:bg-purple-500/5 hover:border-purple-500/30 transition-all duration-300 rounded-xl group"
            onClick={() => onStarterClick("How to start sustainability reporting?")}
          >
            <div className="p-1.5 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
              <AlertCircle className="h-4 w-4 text-purple-500" />
            </div>
            <span className="text-sm font-medium">How to start sustainability reporting?</span>
          </Button>
        </div>

        <div className="pt-6">
          <Button 
            onClick={onNewChat} 
            variant="outline" 
            className="w-full bg-gradient-to-r from-primary/10 to-sky-500/10 hover:from-primary/20 hover:to-sky-500/20 border-primary/20 rounded-xl py-3 flex items-center justify-center gap-2 transition-all duration-300"
          >
            <MessageSquarePlus className="h-4 w-4" />
            <span className="font-medium">New Conversation</span>
            <Sparkles className="h-3 w-3 text-yellow-400 animate-pulse" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationStarters;
