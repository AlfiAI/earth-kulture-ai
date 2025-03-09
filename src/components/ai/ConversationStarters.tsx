
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <div className="flex-1 overflow-auto p-3 flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center mb-4 space-y-2">
          <h3 className="text-lg font-medium">How can Waly Pro help today?</h3>
          <p className="text-sm text-muted-foreground">Try one of these conversation starters</p>
        </div>
        
        <div className="grid gap-2">
          {starters.map((starter, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start gap-2 h-auto py-2.5 px-3 text-left hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() => onStarterClick(starter.text)}
            >
              {starter.icon}
              <span className="text-sm font-normal">{starter.text}</span>
            </Button>
          ))}
        </div>

        <div className="pt-4">
          <Button 
            onClick={onNewChat} 
            variant="outline" 
            className="w-full bg-primary/5 border-primary/20 hover:bg-primary/10 flex items-center justify-center gap-2"
          >
            <MessageSquarePlus className="h-4 w-4" />
            <span>New Conversation</span>
            <Sparkles className="h-3 w-3 text-primary" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationStarters;
