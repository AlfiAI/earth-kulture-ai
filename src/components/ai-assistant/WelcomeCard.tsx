
import { Bot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const WelcomeCard = () => {
  return (
    <Card className="bg-gradient-to-r from-primary/10 to-muted border-primary/20">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-1">Your Intelligent ESG Assistant</h2>
            <p className="text-muted-foreground mb-3">
              Ask questions about ESG metrics, compliance, or sustainability trends
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
