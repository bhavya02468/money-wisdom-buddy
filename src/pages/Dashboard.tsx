import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { Wallet, TrendingUp, PiggyBank, CreditCard, Shield, ListChecks } from "lucide-react";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

// Sample data for the charts
const sampleMonthlyData = [
  { month: "Jan'24", amount: 3200 },
  { month: "Feb'24", amount: 2800 },
  { month: "Mar'24", amount: 3500 },
  { month: "Apr'24", amount: 2900 },
  { month: "May'24", amount: 3100 },
  { month: "Jun'24", amount: 2750 },
];

// Sample data for spending by category
const spendingByCategory = [
  { name: "Housing", value: 1200 },
  { name: "Food", value: 500 },
  { name: "Transportation", value: 300 },
  { name: "Entertainment", value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ month: string; amount: number }[]>(sampleMonthlyData);
  const [progress, setProgress] = useState(68); // Sample progress for financial goal
  const [creditScore, setCreditScore] = useState(720); // Sample credit score

  useEffect(() => {
    const savedExpenses = localStorage.getItem("monthlyExpenses");
    if (savedExpenses) {
      const parsedExpenses = JSON.parse(savedExpenses) as Expense[];
      setExpenses(parsedExpenses);

      // Process expenses into monthly data
      const monthlyTotals = parsedExpenses.reduce<{ [key: string]: number }>((acc, expense) => {
        const date = new Date(expense.date);
        const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
        acc[monthYear] = (acc[monthYear] || 0) + expense.amount;
        return acc;
      }, {});

      const chartData = Object.entries(monthlyTotals).map(([month, amount]) => ({
        month,
        amount: amount as number,
      }));

      // Only update monthly data if we have real expenses
      if (chartData.length > 0) {
        setMonthlyData(chartData);
      }
    }
  }, []);

  const totalExpenses = expenses.length > 0 
    ? expenses.reduce((sum, expense) => sum + expense.amount, 0)
    : sampleMonthlyData.reduce((sum, data) => sum + data.amount, 0);
    
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Expenses Overview */}
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

          {/* Spending by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer config={{}}>
                  <PieChart>
                    <Pie
                      data={spendingByCategory}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {spendingByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Goal Progress */}
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

          {/* Credit Score Card */}
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

          {/* Subscription Analysis */}
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
    </Layout>
  );
};

export default Dashboard;