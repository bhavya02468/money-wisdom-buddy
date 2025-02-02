import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, ArrowUp, ArrowDown, TrendingUp, Brain } from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InvestmentAdvisor } from "@/components/InvestmentAdvisor";

const Investments = () => {
  const { toast } = useToast();
  const [aiSuggestion, setAiSuggestion] = useState("");
  
  const stockInvestments = [
    {
      symbol: "AC",
      name: "Air Canada",
      shares: 10,
      purchasePrice: 19.00,
      currentPrice: 25.02,
      change: 31.68,
      changeAmount: 6.02,
      data: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        price: 19 + Math.sin(i * 0.4) * 8 + (i * 0.2)
      }))
    },
    {
      symbol: "TD",
      name: "Toronto-Dominion Bank",
      shares: 15,
      purchasePrice: 82.50,
      currentPrice: 65.25,
      change: -20.91,
      changeAmount: -17.25,
      data: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        price: 82.5 - Math.sin(i * 0.3) * 10 - (i * 0.3)
      }))
    },
    {
      symbol: "CNR",
      name: "Canadian National Railway",
      shares: 8,
      purchasePrice: 156.75,
      currentPrice: 189.30,
      change: 20.77,
      changeAmount: 32.55,
      data: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        price: 156.75 + Math.cos(i * 0.2) * 15 + (i * 0.8)
      }))
    }
  ];

  // Calculate portfolio data
  const portfolioData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const dayData = {
        day: i + 1,
        total: 0
      };
      
      stockInvestments.forEach(stock => {
        dayData.total += stock.data[i].price * stock.shares;
      });

      return dayData;
    });
  }, [stockInvestments]);

  // Calculate total portfolio value and change
  const totalPortfolioValue = stockInvestments.reduce(
    (sum, stock) => sum + (stock.currentPrice * stock.shares),
    0
  );

  const initialPortfolioValue = stockInvestments.reduce(
    (sum, stock) => sum + (stock.purchasePrice * stock.shares),
    0
  );

  const totalChange = ((totalPortfolioValue - initialPortfolioValue) / initialPortfolioValue) * 100;

  useEffect(() => {
    const getAiSuggestion = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('analyze-finances', {
          body: { 
            type: 'investment_suggestion',
            stocks: stockInvestments.map(stock => ({
              symbol: stock.symbol,
              currentPrice: stock.currentPrice,
              purchasePrice: stock.purchasePrice,
              change: stock.change
            }))
          },
        });

        if (error) throw error;
        if (data?.suggestions) {
          setAiSuggestion(data.suggestions);
        }
      } catch (error) {
        console.error('Error getting AI suggestions:', error);
        toast({
          title: "Error",
          description: "Failed to get AI suggestions",
          variant: "destructive",
        });
      }
    };

    getAiSuggestion();
  }, [toast]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Investment Portfolio</h1>
      
      {/* AI Investment Advisor */}
      {aiSuggestion && (
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-blue-100">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">AI Investment Insights</h3>
                <p className="text-gray-700 whitespace-pre-line">{aiSuggestion}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Portfolio Overview Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Portfolio Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Total Portfolio Value</p>
              <p className="text-2xl font-bold">${totalPortfolioValue.toFixed(2)} CAD</p>
            </div>
            <div className="flex items-center">
              {totalChange >= 0 ? (
                <ArrowUp className="w-5 h-5 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="w-5 h-5 text-red-500 mr-1" />
              )}
              <span className={`text-lg ${totalChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(totalChange).toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={portfolioData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)} CAD`, 'Portfolio Value']}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total Portfolio Value"
                  stroke="#0066CC"
                  strokeWidth={2}
                  dot={false}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Individual Stocks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="w-6 h-6" />
            Individual Stocks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {stockInvestments.map((stock, index) => (
              <Card key={index} className="p-4 hover:shadow-lg transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {stock.symbol}
                      </div>
                      <div>
                        <h3 className="font-semibold">{stock.symbol}</h3>
                        <p className="text-sm text-gray-500">{stock.name}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-[100px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={stock.data}>
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke={stock.change >= 0 ? "#22c55e" : "#ef4444"} 
                          dot={false}
                        />
                        <XAxis dataKey="day" hide />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-semibold">
                      ${stock.currentPrice.toFixed(2)} CAD
                    </div>
                    <div className="flex items-center justify-end gap-1 text-sm">
                      {stock.change >= 0 ? (
                        <ArrowUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={stock.change >= 0 ? "text-green-500" : "text-red-500"}>
                        ${Math.abs(stock.changeAmount).toFixed(2)} ({Math.abs(stock.change).toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Investments;