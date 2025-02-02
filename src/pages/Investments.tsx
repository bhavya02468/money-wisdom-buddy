import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { LineChart } from "lucide-react";
import { StockInsights } from "@/components/StockInsights";

const Investments = () => {
  const { toast } = useToast();

  const generateStockData = (initialPrice: number, volatility: number, trend: number) => {
    const data = [];
    let price = initialPrice;
    
    for (let i = 0; i < 30; i++) {
      const random = Math.sin(i / 3) * volatility + trend;
      price = price + random;
      if (price < 0) price = 0;
      
      data.push({
        day: i + 1,
        price: parseFloat(price.toFixed(2))
      });
    }
    
    return data;
  };

  const stockInvestments = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      currentPrice: 180.25,
      purchasePrice: 150.50,
      change: 19.77,
      data: generateStockData(150, 2, 0.5)
    },
    {
      symbol: "TD",
      name: "TD Bank",
      currentPrice: 65.30,
      purchasePrice: 85.20,
      change: -23.36,
      data: generateStockData(85, 3, -0.8)
    },
    {
      symbol: "CNR",
      name: "Canadian National Railway",
      currentPrice: 156.75,
      purchasePrice: 145.30,
      change: 7.88,
      data: generateStockData(145, 1.5, 0.3)
    },
    {
      symbol: "BCE",
      name: "BCE Inc.",
      currentPrice: 62.45,
      purchasePrice: 58.90,
      change: 6.03,
      data: generateStockData(58, 1, 0.2)
    }
  ];

  useEffect(() => {
    toast({
      title: "Investment Portfolio Loaded",
      description: "Your investment data has been updated.",
    });
  }, [toast]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Investment Portfolio</h1>
      
      <StockInsights stocks={stockInvestments} />
      
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4">
          <LineChart className="w-8 h-8 text-primary" />
          <div>
            <CardTitle>Stock Performance</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stockInvestments.map((stock) => (
              <Card key={stock.symbol} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">{stock.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{stock.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">${stock.currentPrice}</p>
                      <p className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change}%
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={stock.data}>
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke={stock.change >= 0 ? "#16a34a" : "#dc2626"}
                          strokeWidth={2}
                          dot={false}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Investments;
