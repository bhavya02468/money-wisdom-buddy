import { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const AIAdvisorWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ type: string; content: string }>>([
    {
      type: "assistant",
      content: "Hello! I'm your AI financial advisor. How can I help you today?",
    },
  ]);
  const location = useLocation();

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleAIChat = (event: CustomEvent) => {
      setIsOpen(true);
      setChatHistory(prev => [...prev, { 
        type: "assistant", 
        content: event.detail.message 
      }]);
    };

    window.addEventListener('openAIChat', handleAIChat as EventListener);
    
    if (location.pathname === "/investments") {
      setIsOpen(true);
    }

    return () => {
      window.removeEventListener('openAIChat', handleAIChat as EventListener);
    };
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat
    setChatHistory((prev) => [...prev, { type: "user", content: message }]);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const response = await supabase.functions.invoke("analyze-finances", {
        body: {
          type: "chat",
          userId: user.id,
          message: message,
        },
      });

      if (response.error) throw response.error;

      // Add AI response to chat
      setChatHistory((prev) => [
        ...prev,
        { type: "assistant", content: response.data.response },
      ]);
    } catch (error) {
      console.error("Error in chat:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          type: "assistant",
          content: "I apologize, but I'm having trouble responding right now. Please try again later.",
        },
      ]);
    }

    setMessage("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-80 p-4 shadow-lg bg-white border">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <img
                src="/lovable-uploads/2cc60c20-704c-4e74-8ef7-0baba9ed0820.png"
                alt="AI Advisor"
                className="w-8 h-8 rounded-full"
              />
              <span className="font-semibold">AI Advisor</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleWidget}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4 h-[300px] overflow-y-auto mb-4 bg-white">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.type === "user"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      ) : (
        <Button
          onClick={toggleWidget}
          className="rounded-full h-12 w-12 shadow-lg bg-white"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};