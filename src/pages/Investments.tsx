import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { StockInsights } from "@/components/StockInsights";

const Investments = () => {
  const [stockData, setStockData] = useState([
    { name: "Jan", AAPL: 4000, GOOGL: 2400, MSFT: 2210, AMZN: 3200 },
    { name: "Feb", AAPL: 3000, GOOGL: 1398, MSFT: 2210, AMZN: 3400 },
    { name: "Mar", AAPL: 2000, GOOGL: 9800, MSFT: 2290, AMZN: 3100 },
    { name: "Apr", AAPL: 2780, GOOGL: 3908, MSFT: 2000, AMZN: 3300 },
    { name: "May", AAPL: 1890, GOOGL: 4800, MSFT: 2181, AMZN: 3500 },
    { name: "Jun", AAPL: 2390, GOOGL: 3800, MSFT: 2500, AMZN: 3600 },
  ]);

  const stocks = [
    { symbol: "AAPL", currentPrice: 182.52, purchasePrice: 170.25, change: 7.21, name: "Apple Inc." },
    { symbol: "GOOGL", currentPrice: 142.38, purchasePrice: 130.45, change: 9.14, name: "Alphabet Inc." },
    { symbol: "MSFT", currentPrice: 403.78, purchasePrice: 380.12, change: 6.22, name: "Microsoft Corp." },
    { symbol: "AMZN", currentPrice: 171.81, purchasePrice: 155.50, change: 10.49, name: "Amazon.com Inc." },
  ];

  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This will trigger the AI chat widget to open
    const event = new CustomEvent("openAIChat", {
      detail: {
        message: "I notice you're looking at your investments. Would you like me to analyze your current stock portfolio and provide recommendations for each stock?"
      }
    });
    window.dispatchEvent(event);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Investment Portfolio</h1>
        
        <StockInsights stocks={stocks} />

        {/* Stock Performance Chart */}
        <Card className="p-6 bg-white shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Stock Performance</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stockData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="AAPL"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="GOOGL" stroke="#82ca9d" />
                <Line type="monotone" dataKey="MSFT" stroke="#ffc658" />
                <Line type="monotone" dataKey="AMZN" stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Investments;