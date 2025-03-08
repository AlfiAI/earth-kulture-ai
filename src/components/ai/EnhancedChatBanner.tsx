
import { Brain, Zap, Database, Star, BarChart } from 'lucide-react';

const EnhancedChatBanner = () => {
  return (
    <div className="bg-primary/10 border-b px-4 py-2 flex items-center gap-2">
      <Brain className="h-4 w-4 text-primary" />
      <span className="text-xs text-muted-foreground">DeepSeek-R1 powered intelligence</span>
      <div className="ml-auto flex items-center gap-2">
        <Star className="h-3 w-3 text-yellow-500" />
        <span className="text-xs text-yellow-500 mr-2">Advanced AI</span>
        <BarChart className="h-3 w-3 text-green-500" />
      </div>
    </div>
  );
};

export default EnhancedChatBanner;
