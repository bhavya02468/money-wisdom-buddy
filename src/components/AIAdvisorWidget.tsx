import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Send, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const AIAdvisorWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      type: "assistant",
      content: "Hello! I'm your AI financial advisor. How can I help you today?",
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    setChatHistory((prev) => [...prev, { type: "user", content: message }]);
    
    // Simulate AI response
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          type: "assistant",
          content: "I understand your question about finances. Let me help you with that. What specific aspects would you like to know more about?",
        },
      ]);
    }, 1000);

    setMessage("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-[350px] bg-white shadow-xl animate-fade-in">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg
                width="32"
                height="32"
                viewBox="0 0 100 100"
                className="rounded-full bg-primary/10 p-1"
              >
                <circle cx="50" cy="50" r="45" fill="#0066CC" opacity="0.2" />
                <circle cx="35" cy="40" r="5" fill="#0066CC" /> {/* Left eye */}
                <circle cx="65" cy="40" r="5" fill="#0066CC" /> {/* Right eye */}
                <path
                  d="M 35 60 Q 50 70 65 60"
                  stroke="#0066CC"
                  strokeWidth="3"
                  fill="none"
                /> {/* Smile */}
              </svg>
              <div className="relative flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full absolute -left-3" />
                <span className="text-sm font-medium">Online</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="h-[400px] overflow-y-auto p-4 space-y-4">
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
                      : "bg-gray-100"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div 
          className="relative cursor-pointer hover:scale-105 transition-transform animate-floating"
          onClick={() => setIsOpen(true)}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 100 100"
            className="rounded-full border-2 border-white shadow-lg bg-primary/10"
          >
            <circle cx="50" cy="50" r="45" fill="#0066CC" opacity="0.2" />
            <circle cx="35" cy="40" r="5" fill="#0066CC" /> {/* Left eye */}
            <circle cx="65" cy="40" r="5" fill="#0066CC" /> {/* Right eye */}
            <path
              d="M 35 60 Q 50 70 65 60"
              stroke="#0066CC"
              strokeWidth="3"
              fill="none"
              className="animate-wave"
            /> {/* Smile */}
            <g className="animate-wave">
              <path
                d="M 75 45 Q 85 35 90 45"
                stroke="#0066CC"
                strokeWidth="3"
                fill="none"
              /> {/* Waving arm */}
            </g>
          </svg>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        </div>
      )}
    </div>
  );
};