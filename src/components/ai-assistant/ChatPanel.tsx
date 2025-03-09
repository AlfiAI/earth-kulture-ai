
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare, Bot, User } from "lucide-react";
import { MessageProps } from "./types";

interface ChatPanelProps {
  messages: MessageProps[];
  query: string;
  setQuery: (query: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
}

const ChatPanel = ({ messages, query, setQuery, handleSendMessage }: ChatPanelProps) => {
  return (
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
  );
};

export default ChatPanel;
