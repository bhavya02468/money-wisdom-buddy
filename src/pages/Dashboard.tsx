import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { Wallet, TrendingUp, PiggyBank, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

const Dashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ month: string; amount: number }[]>([]);

  useEffect(() => {
    const savedExpenses = localStorage.getItem("monthlyExpenses");
    if (savedExpenses) {
      const parsedExpenses = JSON.parse(savedExpenses);
      setExpenses(parsedExpenses);

      // Process expenses into monthly data
      const monthlyTotals = parsedExpenses.reduce((acc: { [key: string]: number }, expense: Expense) => {
        const date = new Date(expense.date);
        const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
        acc[monthYear] = (acc[monthYear] || 0) + expense.amount;
        return acc;
      }, {});

      const chartData = Object.entries(monthlyTotals).map(([month, amount]) => ({
        month,
        amount,
      }));

      setMonthlyData(chartData);
    }
  }, []);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyIncome = 8250; // This could be made dynamic in the future
  const totalSavings = monthlyIncome - totalExpenses;

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
                  <p className="text-2xl font-semibold">${(monthlyIncome - totalExpenses).toFixed(2)}</p>
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
                  <p className="text-2xl font-semibold">${monthlyIncome.toFixed(2)}</p>
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
                  <p className="text-2xl font-semibold">${totalSavings.toFixed(2)}</p>
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
                  <p className="text-2xl font-semibold">${totalExpenses.toFixed(2)}</p>
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
                <BarChart data={monthlyData}>
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