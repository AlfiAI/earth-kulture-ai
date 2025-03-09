
import DashboardLayout from "@/components/layout/DashboardLayout";
import AIAssistantHeader from "@/components/ai-assistant/AIAssistantHeader";
import WelcomeCard from "@/components/ai-assistant/WelcomeCard";
import AIAssistantTabs from "@/components/ai-assistant/AIAssistantTabs";
import { useAIAssistant } from "@/hooks/use-ai-assistant";

const AIAssistant = () => {
  const { query, setQuery, messages, handleSendMessage } = useAIAssistant();

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <AIAssistantHeader title="AI Assistant" />
        <WelcomeCard />
        <AIAssistantTabs 
          messages={messages}
          query={query}
          setQuery={setQuery}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </DashboardLayout>
  );
};

export default AIAssistant;
