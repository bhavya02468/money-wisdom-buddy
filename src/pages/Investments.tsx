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

const Investments = () => {
  const [stockData, setStockData] = useState([
    { name: "Jan", AAPL: 4000, GOOGL: 2400, MSFT: 2400 },
    { name: "Feb", AAPL: 3000, GOOGL: 1398, MSFT: 2210 },
    { name: "Mar", AAPL: 2000, GOOGL: 9800, MSFT: 2290 },
    { name: "Apr", AAPL: 2780, GOOGL: 3908, MSFT: 2000 },
    { name: "May", AAPL: 1890, GOOGL: 4800, MSFT: 2181 },
    { name: "Jun", AAPL: 2390, GOOGL: 3800, MSFT: 2500 },
  ]);

  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user found");

        const response = await supabase.functions.invoke("analyze-finances", {
          body: {
            type: "stocks",
            userId: user.id,
          },
        });

        if (response.error) throw response.error;
        setInsights(response.data.insights || "No insights available at the moment.");
      } catch (error) {
        console.error("Error fetching insights:", error);
        setInsights("Unable to fetch insights at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Investment Portfolio</h1>
        
        {/* Stock Insights Card */}
        <Card className="p-6 mb-8 bg-white shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Stock Market Insights</h2>
          <div className="text-gray-700">
            {loading ? (
              <p>Loading insights...</p>
            ) : (
              <div className="prose max-w-none">
                {insights.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            )}
          </div>
        </Card>

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
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Investments;