
import { Brain, Zap, Database } from 'lucide-react';

const EnhancedChatBanner = () => {
  return (
    <div className="bg-primary/5 border-b px-4 py-2 flex items-center gap-2">
      <Brain className="h-4 w-4 text-primary" />
      <span className="text-xs text-muted-foreground">AI-powered benchmarking & predictive analytics enabled</span>
      <div className="ml-auto flex items-center gap-2">
        <Zap className="h-3 w-3 text-yellow-500" />
        <span className="text-xs text-yellow-500 mr-2">Database optimized</span>
        <Database className="h-3 w-3 text-green-500" />
      </div>
    </div>
  );
};

export default EnhancedChatBanner;
