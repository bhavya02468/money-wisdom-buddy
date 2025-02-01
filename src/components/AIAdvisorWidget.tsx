import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export const AIAdvisorWidget = () => {
  const navigate = useNavigate();

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4">
        <img
          src="/lovable-uploads/2cc60c20-704c-4e74-8ef7-0baba9ed0820.png"
          alt="AI Advisor"
          className="w-16 h-16"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">AI Financial Advisor</h3>
          <p className="text-text-light text-sm mb-2">
            Get personalized financial advice from your AI companion
          </p>
          <Button
            variant="outline"
            className="text-primary hover:text-primary-dark"
            onClick={() => navigate("/chat")}
          >
            Start Chat
          </Button>
        </div>
      </div>
    </Card>
  );
};