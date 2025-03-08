
import { Brain } from 'lucide-react';

const EnhancedChatBanner = () => {
  return (
    <div className="bg-primary/5 border-b px-4 py-2 flex items-center gap-2">
      <Brain className="h-4 w-4 text-primary" />
      <span className="text-xs text-muted-foreground">AI-powered benchmarking & predictive analytics enabled</span>
    </div>
  );
};

export default EnhancedChatBanner;
