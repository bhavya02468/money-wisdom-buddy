import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Wallet, TrendingUp, PiggyBank, CreditCard, Shield, ListChecks, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

// Sample data for the charts
const sampleMonthlyData = [
  { month: "Jan'24", amount: 3200, change: -5 },
  { month: "Feb'24", amount: 2800, change: -12.5 },
  { month: "Mar'24", amount: 3500, change: +25 },
  { month: "Apr'24", amount: 2900, change: -17.1 },
  { month: "May'24", amount: 3100, change: +6.9 },
  { month: "Jun'24", amount: 2750, change: -11.3 },
];

// Enhanced spending by category data with descriptions
const spendingByCategory = [
  { 
    name: "Housing", 
    value: 1200,
    description: "Rent, utilities, and home maintenance",
    percentage: 54.5
  },
  { 
    name: "Food", 
    value: 500,
    description: "Groceries and dining out",
    percentage: 22.7
  },
  { 
    name: "Transportation", 
    value: 300,
    description: "Fuel, public transit, and car maintenance",
    percentage: 13.6
  },
  { 
    name: "Entertainment", 
    value: 200,
    description: "Movies, events, and hobbies",
    percentage: 9.2
  },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ month: string; amount: number; change: number }[]>(sampleMonthlyData);
  const [progress, setProgress] = useState(68);
  const [creditScore, setCreditScore] = useState(720);

  useEffect(() => {
    const savedExpenses = localStorage.getItem("monthlyExpenses");
    if (savedExpenses) {
      const parsedExpenses = JSON.parse(savedExpenses) as Expense[];
      setExpenses(parsedExpenses);

      const monthlyTotals = parsedExpenses.reduce<{ [key: string]: number }>((acc, expense) => {
        const date = new Date(expense.date);
        const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
        acc[monthYear] = (acc[monthYear] || 0) + expense.amount;
        return acc;
      }, {});

      if (Object.keys(monthlyTotals).length > 0) {
        const chartData = Object.entries(monthlyTotals).map(([month, amount], index, array) => {
          const prevAmount = index > 0 ? array[index - 1][1] : amount;
          const change = ((amount - prevAmount) / prevAmount) * 100;
          return {
            month,
            amount: amount as number,
            change: Number(change.toFixed(1))
          };
        });
        setMonthlyData(chartData);
      }
    }
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const totalExpenses = expenses.length > 0 
    ? expenses.reduce((sum, expense) => sum + expense.amount, 0)
    : sampleMonthlyData.reduce((sum, data) => sum + data.amount, 0);
    
  const monthlyIncome = 8250;
  const totalSavings = monthlyIncome - totalExpenses;

  // Get previous month's values for comparison
  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  
  const getChangeIndicator = (change: number) => {
    return change > 0 ? '+' : '';
  };

  // Sort categories by value to get top spenders
  const topSpendingCategories = [...spendingByCategory]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Financial Dashboard</h1>
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light">Total Balance</p>
                <p className="text-2xl font-semibold">
                  ${(monthlyIncome - totalExpenses).toFixed(2)}
                  <span className="text-sm ml-2 text-gray-500">
                    {getChangeIndicator(currentMonth?.change || 0)}
                    {currentMonth?.change || 0}%
                  </span>
                </p>
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
                <p className="text-2xl font-semibold">
                  ${monthlyIncome.toFixed(2)}
                  <span className="text-sm ml-2 text-gray-500">
                    {getChangeIndicator(0)}0%
                  </span>
                </p>
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
                <p className="text-2xl font-semibold">
                  ${totalSavings.toFixed(2)}
                  <span className="text-sm ml-2 text-gray-500">
                    {getChangeIndicator(currentMonth?.change || 0)}
                    {currentMonth?.change || 0}%
                  </span>
                </p>
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
                <p className="text-2xl font-semibold">
                  ${totalExpenses.toFixed(2)}
                  <span className="text-sm ml-2 text-gray-500">
                    {getChangeIndicator(currentMonth?.change || 0)}
                    {currentMonth?.change || 0}%
                  </span>
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
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

        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] relative">
              <ChartContainer config={{}}>
                <PieChart>
                  <Pie
                    data={spendingByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                  >
                    {spendingByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ChartContainer>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Top Spending Categories:</h4>
                {topSpendingCategories.map((category, index) => (
                  <div key={index} className="flex justify-between items-center mb-2">
                    <span className="text-sm">
                      {index + 1}. {category.name}
                    </span>
                    <span className="text-sm font-medium">
                      ${category.value} ({category.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="w-5 h-5" />
              Financial Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                You're {progress}% of the way to your savings goal
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Credit Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{creditScore}</div>
              <p className="text-sm text-muted-foreground">
                Your credit score is {creditScore >= 700 ? 'Excellent' : creditScore >= 650 ? 'Good' : 'Fair'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="w-5 h-5" />
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Netflix", amount: 15.99, date: "Monthly on 15th" },
                { name: "Spotify", amount: 9.99, date: "Monthly on 1st" },
                { name: "Gym Membership", amount: 49.99, date: "Monthly on 5th" }
              ].map((sub, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-secondary/10">
                  <div>
                    <p className="font-medium">{sub.name}</p>
                    <p className="text-sm text-muted-foreground">{sub.date}</p>
                  </div>
                  <p className="font-medium">${sub.amount}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;