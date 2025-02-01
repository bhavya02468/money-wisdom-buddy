import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Brain, LineChart, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-5xl font-bold text-text mb-6">
          Your AI-Powered Financial Companion
        </h1>
        <p className="text-xl text-text-light mb-8 max-w-2xl mx-auto">
          Make smarter financial decisions with personalized guidance and insights powered by artificial intelligence.
        </p>
        <Button 
          className="bg-primary hover:bg-primary-dark text-white px-8 py-6 text-lg rounded-lg"
          onClick={() => navigate("/login")}
        >
          Get Started <ArrowRight className="ml-2" />
        </Button>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card className="p-6 animate-slide-up hover:shadow-lg transition-shadow">
          <Brain className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">AI Financial Advisor</h3>
          <p className="text-text-light mb-4">
            Get instant answers to your financial questions from our AI advisor.
          </p>
          <Button 
            variant="link" 
            className="text-primary hover:text-primary-dark p-0 h-auto"
            onClick={() => navigate("/login")}
          >
            Start Chat <ArrowRight className="ml-1 w-4 h-4" />
          </Button>
        </Card>

        <Card className="p-6 animate-slide-up hover:shadow-lg transition-shadow [animation-delay:200ms]">
          <LineChart className="w-12 h-12 text-secondary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Financial Dashboard</h3>
          <p className="text-text-light mb-4">
            Track your financial health with our comprehensive dashboard.
          </p>
          <Button 
            variant="link" 
            className="text-primary hover:text-primary-dark p-0 h-auto"
            onClick={() => navigate("/login")}
          >
            View Dashboard <ArrowRight className="ml-1 w-4 h-4" />
          </Button>
        </Card>

        <Card className="p-6 animate-slide-up hover:shadow-lg transition-shadow [animation-delay:400ms]">
          <BookOpen className="w-12 h-12 text-accent mb-4" />
          <h3 className="text-xl font-semibold mb-2">Financial Education</h3>
          <p className="text-text-light mb-4">
            Learn about personal finance with our curated resources.
          </p>
          <Button 
            variant="link" 
            className="text-primary hover:text-primary-dark p-0 h-auto"
            onClick={() => navigate("/login")}
          >
            Start Learning <ArrowRight className="ml-1 w-4 h-4" />
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Index;