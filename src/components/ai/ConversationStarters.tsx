
import { Button } from "@/components/ui/button";
import { MessageSquarePlus, Sparkles } from "lucide-react";
import { ReactNode } from "react";

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
    <div className="flex-1 overflow-auto p-4 flex flex-col items-center justify-center bg-gradient-to-b from-card to-background/80">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center mb-6 space-y-2">
          <h3 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-sky-500">
            How can Waly help today?
          </h3>
          <p className="text-sm text-muted-foreground">Select a conversation starter</p>
        </div>
        
        <div className="grid gap-3">
          {starters.map((starter, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-3 px-4 text-left hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 rounded-xl group"
              onClick={() => onStarterClick(starter.text)}
            >
              <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                {starter.icon}
              </div>
              <span className="text-sm font-medium">{starter.text}</span>
            </Button>
          ))}
        </div>

        <div className="pt-6">
          <Button 
            onClick={onNewChat} 
            variant="outline" 
            className="w-full bg-gradient-to-r from-primary/20 to-sky-500/20 hover:from-primary/30 hover:to-sky-500/30 border-primary/20 rounded-xl py-3 flex items-center justify-center gap-2 transition-all duration-300"
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
