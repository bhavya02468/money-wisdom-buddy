import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";

const Chat = () => {
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
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="mb-4">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-semibold">AI Financial Advisor</h1>
              </div>
              
              <div className="space-y-4 mb-6 h-[400px] overflow-y-auto">
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

              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your financial question..."
                  className="flex-1"
                />
                <Button type="submit">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;