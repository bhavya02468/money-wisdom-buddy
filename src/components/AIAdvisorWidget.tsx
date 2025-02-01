import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

export const AIAdvisorWidget = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="p-4 hover:shadow-lg transition-shadow w-[300px] bg-white">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="/lovable-uploads/2cc60c20-704c-4e74-8ef7-0baba9ed0820.png"
              alt="AI Advisor"
              className="w-12 h-12"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-1">AI Financial Advisor</h3>
            <p className="text-text-light text-xs mb-2">
              Get personalized financial advice
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-primary hover:text-primary-dark w-full"
              onClick={() => navigate("/chat")}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Start Chat
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};