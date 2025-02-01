import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Wallet, TrendingUp, PiggyBank, CreditCard, Shield, ListChecks, ArrowUp, ArrowDown, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useMonthlyExpenses } from "@/hooks/useExpenses";
import { useMonthlyIncome } from "@/hooks/useIncome";
import { useFinancialGoals } from "@/hooks/useFinancialGoals";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const { monthlyData: expenseData, spendingByCategory } = useMonthlyExpenses();
  const { monthlyData: incomeData } = useMonthlyIncome();
  const { data: goals } = useFinancialGoals();
  
  // Calculate current month totals
  const currentMonthExpense = expenseData[0]?.amount || 0;
  const currentMonthIncome = incomeData[0]?.amount || 0;
  const monthlySavings = currentMonthIncome - currentMonthExpense;

  // Calculate total balance (sum of all income minus sum of all expenses)
  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const totalBalance = totalIncome - totalExpenses;
  
  // Get the primary financial goal (assuming it's the first one)
  const primaryGoal = goals?.[0];
  const goalProgress = primaryGoal ? (primaryGoal.current_amount / primaryGoal.target_amount) * 100 : 0;

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-lg text-gray-500 mb-4">No data available</p>
      <p className="text-sm text-gray-400">Start by adding some income or expenses</p>
    </div>
  );
  
  // Prepare data for line chart (last 6 months)
  const lineChartData = expenseData.slice(0, 6).map((expense, index) => {
    const income = incomeData[index] || { amount: 0 };
    const balance = income.amount - expense.amount;
    return {
      month: expense.month,
      expense: expense.amount,
      balance: balance
    };
  });

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
                  ${totalBalance.toFixed(2)}
                  {getChangeIndicator(expenseData[0]?.change || 0)}
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
                  ${currentMonthIncome.toFixed(2)}
                  {getChangeIndicator(incomeData[0]?.change || 0)}
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
                <p className="text-sm text-text-light">Monthly Savings</p>
                <p className="text-2xl font-semibold">
                  ${monthlySavings.toFixed(2)}
                  {getChangeIndicator(expenseData[0]?.change || 0)}
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
                <p className="text-sm text-text-light">Monthly Expenses</p>
                <p className="text-2xl font-semibold">
                  ${currentMonthExpense.toFixed(2)}
                  {getChangeIndicator(expenseData[0]?.change || 0)}
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
            <CardTitle>Balance & Expenses Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {lineChartData.length > 0 ? (
              <div className="h-[300px]">
                <ChartContainer config={{ 
                  balance: { color: "#0066CC" },
                  expense: { color: "#FF4444" }
                }}>
                  <LineChart data={lineChartData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip />
                    <Line type="monotone" dataKey="balance" stroke="var(--color-balance)" name="Balance" />
                    <Line type="monotone" dataKey="expense" stroke="var(--color-expense)" name="Expenses" />
                  </LineChart>
                </ChartContainer>
              </div>
            ) : (
              <EmptyState />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {spendingByCategory.length > 0 ? (
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
              </div>
            ) : (
              <EmptyState />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Financial Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            {primaryGoal ? (
              <div className="space-y-4">
                <h3 className="font-medium">{primaryGoal.name}</h3>
                <Progress value={goalProgress} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${primaryGoal.current_amount.toFixed(2)}</span>
                  <span>${primaryGoal.target_amount.toFixed(2)}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  You're {goalProgress.toFixed(1)}% of the way to your goal
                </p>
              </div>
            ) : (
              <EmptyState />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Financial Health Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {monthlySavings > 0 ? "Good" : "Needs Attention"}
              </div>
              <p className="text-sm text-muted-foreground">
                {monthlySavings > 0
                  ? "You're saving money this month!"
                  : "Your expenses exceed your income this month"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="w-5 h-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expenseData.length > 0 ? (
              <div className="space-y-4">
                {expenseData.slice(0, 3).map((expense, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-secondary/10">
                    <div>
                      <p className="font-medium">{expense.month}</p>
                      <p className="text-sm text-muted-foreground">Expenses</p>
                    </div>
                    <p className="font-medium text-red-500">-${expense.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;