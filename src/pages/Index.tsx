import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, PieChart, Wallet, Target, Brain, TrendingUp, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl font-bold text-text">
              Smart Financial Management with{" "}
              <span className="text-primary">FinWise</span>
            </h1>
            <p className="text-xl text-text-light">
              Your AI-powered financial companion that helps you track expenses, manage investments, and achieve your financial goals.
            </p>
            <Button 
              className="bg-primary hover:bg-primary-dark text-white px-8 py-6 text-lg rounded-lg animate-floating"
              onClick={() => navigate("/auth")}
            >
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </div>
          
          {/* Feature Preview Card */}
          <Card className="p-6 shadow-lg bg-white/80 backdrop-blur-sm animate-slide-up">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-text-light">Total Balance</p>
                  <p className="text-2xl font-bold text-primary">$29,316.00</p>
                </div>
                <Wallet className="w-10 h-10 text-primary" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-text-light">Monthly Savings</p>
                  <p className="text-xl font-semibold text-green-600">$4,976.00</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-text-light">Monthly Expenses</p>
                  <p className="text-xl font-semibold text-red-500">$2,024.00</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features for Your Financial Success</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 hover:shadow-lg transition-all duration-300 animate-slide-up bg-white/80 backdrop-blur-sm">
            <PieChart className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Expense Tracking</h3>
            <p className="text-text-light">
              Visualize your spending patterns with detailed charts and categorized expenses.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 animate-slide-up [animation-delay:200ms] bg-white/80 backdrop-blur-sm">
            <Brain className="w-12 h-12 text-secondary mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
            <p className="text-text-light">
              Get personalized recommendations to optimize your spending and savings.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 animate-slide-up [animation-delay:400ms] bg-white/80 backdrop-blur-sm">
            <Target className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Financial Goals</h3>
            <p className="text-text-light">
              Set and track your financial goals with smart progress monitoring.
            </p>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16">
        <Card className="p-8 bg-primary/5 border-none">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Take Control of Your Finances?</h2>
            <p className="text-xl text-text-light max-w-2xl mx-auto">
              Join thousands of users who are already making smarter financial decisions with FinWise.
            </p>
            <Button 
              className="bg-primary hover:bg-primary-dark text-white px-8 py-6 text-lg rounded-lg"
              onClick={() => navigate("/auth")}
            >
              Start Your Journey <ArrowRight className="ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;