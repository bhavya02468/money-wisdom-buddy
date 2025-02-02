import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, ArrowUp, ArrowDown } from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Investments = () => {
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
      symbol: "EIT.UN",
      name: "Canoe EIT Income Fund",
      shares: 50,
      purchasePrice: 13.50,
      currentPrice: 13.73,
      change: 1.25,
      changeAmount: 0.17,
      data: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        price: 13.5 + Math.sin(i * 0.3) * 0.3
      }))
    },
    {
      symbol: "SU",
      name: "Suncor Energy",
      shares: 20,
      purchasePrice: 47.70,
      currentPrice: 47.81,
      change: 0.19,
      changeAmount: 0.09,
      data: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        price: 47.7 + Math.sin(i * 0.3) * 0.2
      }))
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Investment Portfolio</h1>
      
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
                          stroke="#22c55e" 
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