
import { useState } from "react";
import { MessageSquare, Bot, Settings, Lightbulb, User } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const AIAssistant = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { sender: "ai", content: "Hello! I'm your AI ESG assistant. How can I help you today?" }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Add user message
    const userMessage = { sender: "user", content: query };
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "I've analyzed your ESG metrics and found opportunities to improve your social impact score.",
        "Based on recent regulations, I recommend updating your carbon disclosure methodology.",
        "Your environmental metrics are trending positively compared to industry benchmarks.",
        "I've identified potential compliance risks in your supply chain reporting.",
        "Would you like me to generate a detailed sustainability report for your stakeholders?"
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      setMessages(prev => [...prev, { sender: "ai", content: randomResponse }]);
    }, 1000);
    
    setQuery("");
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Assistant</h1>
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">Configure Assistant</span>
          </Button>
        </div>

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
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle>ESG AI Chat</CardTitle>
                <CardDescription>Chat with your AI assistant about ESG topics</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        <Avatar className="h-8 w-8">
                          {message.sender === 'ai' ? (
                            <AvatarImage src="/lovable-uploads/fc07f487-a214-40b3-9914-8b4068465a8a.png" />
                          ) : null}
                          <AvatarFallback className={message.sender === 'ai' ? 'bg-primary/20' : 'bg-secondary'}>
                            {message.sender === 'ai' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`rounded-lg p-3 ${message.sender === 'ai' ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <form onSubmit={handleSendMessage} className="w-full flex gap-2">
                  <Input 
                    placeholder="Ask about ESG metrics, trends, or recommendations..." 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit">Send</Button>
                </form>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Insights</CardTitle>
                <CardDescription>Automated analysis of your ESG data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Carbon Reduction Opportunity",
                      description: "Based on your energy usage patterns, switching to renewable energy could reduce your carbon footprint by approximately 35%.",
                      type: "environmental"
                    },
                    {
                      title: "Diversity Score Improvement",
                      description: "Your workforce diversity metrics are below industry average. Implementing targeted recruiting practices could improve your social score.",
                      type: "social"
                    },
                    {
                      title: "Compliance Risk Alert",
                      description: "Recent changes to EU CSRD requirements may impact your reporting obligations. Review your disclosure framework by Q2 2025.",
                      type: "governance"
                    },
                    {
                      title: "Supply Chain Assessment",
                      description: "25% of your tier 1 suppliers have not provided ESG data. This creates a data gap in your scope 3 emissions calculation.",
                      type: "environmental"
                    }
                  ].map((insight, index) => (
                    <Card key={index} className="border-l-4 border-primary">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{insight.title}</CardTitle>
                        <CardDescription className="text-xs uppercase">
                          {insight.type}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" size="sm">Get Details</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assistant Configuration</CardTitle>
                <CardDescription>Customize your AI assistant experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Assistant Mode</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          id: "reactive",
                          title: "Reactive Mode",
                          description: "Assistant responds only when asked questions"
                        },
                        {
                          id: "proactive",
                          title: "Proactive Mode",
                          description: "Assistant provides insights and suggestions automatically"
                        }
                      ].map((mode) => (
                        <div key={mode.id} className="flex items-start space-x-2">
                          <input 
                            type="radio" 
                            id={mode.id} 
                            name="assistantMode" 
                            className="mt-1"
                            defaultChecked={mode.id === "reactive"}
                          />
                          <div>
                            <Label htmlFor={mode.id} className="font-medium">{mode.title}</Label>
                            <p className="text-sm text-muted-foreground">{mode.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Feature Settings</h3>
                    {[
                      {
                        id: "insights",
                        title: "AI-Generated Insights",
                        description: "Allow the assistant to analyze your data and provide insights"
                      },
                      {
                        id: "recommendations",
                        title: "Personalized Recommendations",
                        description: "Receive tailored sustainability recommendations based on your industry"
                      },
                      {
                        id: "alerts",
                        title: "Compliance Alerts",
                        description: "Get notified about regulatory changes that may affect your reporting"
                      }
                    ].map((setting) => (
                      <div key={setting.id} className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <Label htmlFor={setting.id} className="font-medium">{setting.title}</Label>
                          <p className="text-sm text-muted-foreground">{setting.description}</p>
                        </div>
                        <Switch id={setting.id} defaultChecked={true} />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline">Reset to Defaults</Button>
                <Button>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AIAssistant;
