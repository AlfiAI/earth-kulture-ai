
import { useState } from "react";
import { MessageProps } from "@/components/ai-assistant/types";

export const useAIAssistant = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>([
    { sender: "ai", content: "Hello! I'm your AI ESG assistant. How can I help you today?" }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Add user message
    const userMessage: MessageProps = { sender: "user", content: query };
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
      const aiMessage: MessageProps = { sender: "ai", content: randomResponse };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
    
    setQuery("");
  };

  return {
    query,
    setQuery,
    messages,
    handleSendMessage
  };
};
