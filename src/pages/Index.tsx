import { Button } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import { ArrowRight, PieChart, Wallet, Target, Brain, TrendingUp, DollarSign, ChartLineUp, Robot, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const sampleStocks = [
    { name: "AAPL", change: "+2.5%", price: "$175.84" },
    { name: "MSFT", change: "+1.8%", price: "$338.47" },
    { name: "GOOGL", change: "+3.2%", price: "$125.23" }
  ];

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

      {/* AI Investment Recommendations Section */}
      <div className="container mx-auto px-4 py-16 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">AI-Powered Investment Insights</h2>
          <p className="text-xl text-text-light">Get personalized investment recommendations based on your risk profile and goals</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-white/90">
            <Robot className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Portfolio Analysis</h3>
            <p className="text-text-light mb-4">AI-driven insights to optimize your investment portfolio</p>
            <div className="flex items-center text-primary hover:text-primary-dark cursor-pointer">
              Learn More <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-white/90">
            <Target className="w-12 h-12 text-secondary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Risk Assessment</h3>
            <p className="text-text-light mb-4">Personalized risk analysis and investment strategies</p>
            <div className="flex items-center text-primary hover:text-primary-dark cursor-pointer">
              Learn More <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-white/90">
            <ChartLineUp className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Market Trends</h3>
            <p className="text-text-light mb-4">Real-time market analysis and trend predictions</p>
            <div className="flex items-center text-primary hover:text-primary-dark cursor-pointer">
              Learn More <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </Card>
        </div>
      </div>

      {/* Stock Growth Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Track Your Investments</h2>
          <p className="text-xl text-text-light">Monitor your portfolio performance in real-time</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {sampleStocks.map((stock) => (
            <Card key={stock.name} className="p-6 hover:shadow-lg transition-all duration-300 bg-white/90">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{stock.name}</h3>
                <span className="text-green-500 flex items-center">
                  {stock.change}
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </span>
              </div>
              <p className="text-2xl font-bold text-text">{stock.price}</p>
              <div className="mt-4 h-16 bg-gradient-to-r from-green-100 to-green-50 rounded-lg" />
            </Card>
          ))}
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