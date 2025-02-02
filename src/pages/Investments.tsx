import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, ArrowUp, ArrowDown } from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InvestmentAdvisor } from "@/components/InvestmentAdvisor";

const Investments = () => {
  const { toast } = useToast();
  
  const stockInvestments = [
    {
      symbol: "AC",
      name: "Air Canada",
      shares: 10,
      purchasePrice: 19.00,
      currentPrice: 19.02,
      change: 0.48,
      changeAmount: 0.09,
      data: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        price: 19 + Math.sin(i * 0.3) * 0.5
      }))
    },
    {
      symbol: "TD",
      name: "Toronto-Dominion Bank",
      shares: 15,
      purchasePrice: 82.50,
      currentPrice: 80.25,
      change: -2.73,
      changeAmount: -2.25,
      data: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        price: 82.5 - Math.sin(i * 0.3) * 2.5
      }))
    },
    {
      symbol: "CNR",
      name: "Canadian National Railway",
      shares: 8,
      purchasePrice: 156.75,
      currentPrice: 159.30,
      change: 1.63,
      changeAmount: 2.55,
      data: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        price: 156.75 + Math.sin(i * 0.3) * 3
      }))
    },
    {
      symbol: "BCE",
      name: "BCE Inc.",
      shares: 25,
      purchasePrice: 54.20,
      currentPrice: 52.85,
      change: -2.49,
      changeAmount: -1.35,
      data: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        price: 54.20 - Math.cos(i * 0.3) * 1.5
      }))
    }
  ];

  useEffect(() => {
    // Trigger AI analysis when page loads
    const analyzeStocks = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('analyze-finances', {
          body: { 
            type: 'stocks',
            stocks: stockInvestments.map(stock => ({
              symbol: stock.symbol,
              currentPrice: stock.currentPrice,
              purchasePrice: stock.purchasePrice,
              change: stock.change
            }))
          },
        });

        if (error) throw error;
      } catch (error) {
        console.error('Error analyzing stocks:', error);
      }
    };

    analyzeStocks();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Investment Portfolio</h1>
      
      <InvestmentAdvisor stocks={stockInvestments} />
      
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4">
          <LineChart className="w-8 h-8 text-primary" />
          <CardTitle>Stocks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {stockInvestments.map((stock, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {stock.symbol.slice(0, 2)}
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
                        {stock.changeAmount} ({stock.change}%)
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