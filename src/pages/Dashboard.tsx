import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import {
  Wallet,
  Award,
  PiggyBank,
  CreditCard,
  Shield,
  Target,
  ArrowUp,
  ArrowDown,
  Lightbulb
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useExpenses, useMonthlyExpenses } from "@/hooks/useExpenses";
import { useMonthlyIncome } from "@/hooks/useIncome";
import { useFinancialGoals } from "@/hooks/useFinancialGoals";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RecurringExpenses } from "@/components/RecurringExpenses";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const getCreditScoreColor = (score: number) => {
  if (score >= 800) return "#9b87f5"; // Excellent
  if (score >= 740) return "#31ED50"; // Very Good
  if (score >= 670) return "#6E59A5"; // Good
  if (score >= 580) return "#ea384c"; // Fair
  return "#1A1F2C"; // Poor
};

const getCreditScoreText = (score: number) => {
  if (score >= 800) return "Excellent";
  if (score >= 740) return "Very Good";
  if (score >= 670) return "Good";
  if (score >= 580) return "Fair";
  return "Poor";
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: expenses } = useExpenses();
  const { monthlyData: expenseData, spendingByCategory } = useMonthlyExpenses();
  const { monthlyData: incomeData } = useMonthlyIncome();
  const { data: goals } = useFinancialGoals();
  const [aiInsights, setAiInsights] = useState<string>("");
  const insightsGeneratedRef = useRef(false);

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

  // Filter for last month's recurring expenses
  const currentDate = new Date();
  const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
  
  const recurringExpenses = expenses?.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expense.is_recurring && 
           expenseDate.getMonth() === lastMonth.getMonth() &&
           expenseDate.getFullYear() === lastMonth.getFullYear();
  }) || [];
  
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

  const previousMonthBalance = lineChartData[1]?.balance;
  const balanceChange = previousMonthBalance
    ? ((totalBalance - previousMonthBalance) / previousMonthBalance) * 100
    : 0;

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

  // Hardcoded credit score for demo (you can replace this with real data later)
  const creditScore = 750;
  const creditScoreColor = getCreditScoreColor(creditScore);
  const creditScoreText = getCreditScoreText(creditScore);

  // Add effect to fetch AI insights with user ID only once
  useEffect(() => {
    const getAiInsights = async () => {
      if (insightsGeneratedRef.current) return;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error('No authenticated user found');
          toast({
            title: "Error",
            description: "Please log in to view insights",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        const { data, error } = await supabase.functions.invoke('analyze-finances', {
          body: { 
            type: 'insights',
            userId: user.id,
            expenses: expenses || [],
            income: incomeData || [],
            goals: goals || []
          },
        });

        if (error) {
          toast({
            title: "Error",
            description: "Failed to fetch insights",
            variant: "destructive",
          });
          throw error;
        }
        
        if (data?.suggestions) {
          setAiInsights(data.suggestions);
          insightsGeneratedRef.current = true;
        }
      } catch (error) {
        console.error('Error getting AI insights:', error);
        toast({
          title: "Error",
          description: "Failed to analyze finances",
          variant: "destructive",
        });
      }
    };

    if (expenses || incomeData || goals) {
      getAiInsights();
    }
  }, [expenses, incomeData, goals, toast, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Financial Dashboard</h1>
      </div>

      {/* Top summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light">Total Balance</p>
                <p className="text-2xl font-semibold">
                  ${totalBalance.toFixed(2)}
                  {getChangeIndicator(balanceChange)}
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
                <p className="text-sm text-text-light">Credit Score</p>
                <p className="text-2xl font-semibold" style={{ color: creditScoreColor }}>
                  {creditScore}
                </p>
                <p className="text-sm" style={{ color: creditScoreColor }}>{creditScoreText}</p>
              </div>
              <Award className="w-8 h-8" style={{ color: creditScoreColor }} />
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

      {/* Charts */}
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
            <CardTitle>Expenses by Category</CardTitle>
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
                      innerRadius={0}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                    >
                      {spendingByCategory.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                    />
                  </PieChart>
                </ChartContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-lg text-gray-500 mb-4">No expense data available</p>
                <p className="text-sm text-gray-400">Start by adding some expenses</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom cards: Financial Goal Progress, Financial Health Score, Recurring Expenses, and AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecurringExpenses />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {aiInsights ? (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                  {aiInsights}
                </p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                Generating insights...
              </div>
            )}
          </CardContent>
        </Card>

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
      </div>
    </div>
  );
};

export default Dashboard;
