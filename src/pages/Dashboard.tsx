import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Wallet, TrendingUp, PiggyBank, CreditCard } from "lucide-react";

const data = [
  { month: "Jan", amount: 2400 },
  { month: "Feb", amount: 1398 },
  { month: "Mar", amount: 9800 },
  { month: "Apr", amount: 3908 },
  { month: "May", amount: 4800 },
  { month: "Jun", amount: 3800 },
];

const Dashboard = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Financial Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-light">Total Balance</p>
                  <p className="text-2xl font-semibold">$24,500</p>
                </div>
                <Wallet className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-light">Monthly Income</p>
                  <p className="text-2xl font-semibold">$8,250</p>
                </div>
                <TrendingUp className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-light">Total Savings</p>
                  <p className="text-2xl font-semibold">$12,800</p>
                </div>
                <PiggyBank className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-light">Total Expenses</p>
                  <p className="text-2xl font-semibold">$3,650</p>
                </div>
                <CreditCard className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Monthly Expenses Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={{ amount: { color: "#0066CC" } }}>
                <BarChart data={data}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip />
                  <Bar dataKey="amount" fill="var(--color-amount)" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;