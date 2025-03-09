
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Lightbulb, Settings } from "lucide-react";
import ChatPanel from "./ChatPanel";
import InsightsPanel from "./InsightsPanel";
import SettingsPanel from "./SettingsPanel";
import { MessageProps } from "./types";

interface AIAssistantTabsProps {
  messages: MessageProps[];
  query: string;
  setQuery: (query: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
}

const AIAssistantTabs = ({ messages, query, setQuery, handleSendMessage }: AIAssistantTabsProps) => {
  return (
    <Tabs defaultValue="chat">
      <TabsList className="mb-4">
        <TabsTrigger value="chat">
          <MessageSquare className="h-4 w-4 mr-2" />
          Chat
        </TabsTrigger>
        <TabsTrigger value="insights">
          <Lightbulb className="h-4 w-4 mr-2" />
          Insights
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="chat" className="space-y-4">
        <ChatPanel 
          messages={messages}
          query={query}
          setQuery={setQuery}
          handleSendMessage={handleSendMessage}
        />
      </TabsContent>

      <TabsContent value="insights" className="space-y-4">
        <InsightsPanel />
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <SettingsPanel />
      </TabsContent>
    </Tabs>
  );
};

export default AIAssistantTabs;
