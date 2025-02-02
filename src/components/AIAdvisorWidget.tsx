import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "react-router-dom";

export const AIAdvisorWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Only show automatic popup on investments page
    if (location.pathname === "/investments") {
      setIsOpen(true);
    }
  }, [location]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-80 p-4 shadow-lg">
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
          <div className="space-y-4">
            <p>
              Hello! I'm your AI financial advisor. How can I help you today?
            </p>
            {/* Chat functionality will be implemented here */}
          </div>
        </Card>
      ) : (
        <Button
          onClick={toggleWidget}
          className="rounded-full h-12 w-12 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};
