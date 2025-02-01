import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Wallet, TrendingUp, PiggyBank, CreditCard, Shield, ListChecks, ArrowUp, ArrowDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useMonthlyExpenses } from "@/hooks/useExpenses";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const { monthlyData, spendingByCategory } = useMonthlyExpenses();
  const progress = 68;
  const creditScore = 720;
  
  // Calculate totals
  const currentMonth = monthlyData[0] || { amount: 0, change: 0 };
  const monthlyIncome = 8250; // This could be made dynamic in the future
  const totalExpenses = currentMonth.amount;
  const totalSavings = monthlyIncome - totalExpenses;
  
  const getChangeIndicator = (change: number) => {
    if (change === 0) return null;
    return change > 0 ? (
      <span className="flex items-center text-green-500 text-sm ml-2">
        <ArrowUp className="w-4 h-4 mr-1" />
        {change.toFixed(1)}%
      </span>
    ) : (
      <span className="flex items-center text-red-500 text-sm ml-2">
        <ArrowDown className="w-4 h-4 mr-1" />
        {Math.abs(change).toFixed(1)}%
      </span>
    );
  };

  // Sort categories by value to get top spenders
  const topSpendingCategories = spendingByCategory.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Financial Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light">Total Balance</p>
                <p className="text-2xl font-semibold">
                  ${totalSavings.toFixed(2)}
                  {getChangeIndicator(currentMonth.change)}
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
                  {getChangeIndicator(0)}
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
                  {getChangeIndicator(currentMonth.change)}
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
                  {getChangeIndicator(currentMonth.change)}
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
                      ${category.value.toFixed(2)} ({category.percentage}%)
                      {getChangeIndicator(category.change)}
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