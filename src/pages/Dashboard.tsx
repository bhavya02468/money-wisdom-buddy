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
  Lightbulb,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useExpenses, useMonthlyExpenses } from "@/hooks/useExpenses";
import { useMonthlyIncome } from "@/hooks/useIncome";
import { useFinancialGoals } from "@/hooks/useFinancialGoals";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RecurringExpenses } from "@/components/RecurringExpenses";

// Define colors for pie chart categories.
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

/**
 * Returns a color based on the credit score value.
 * @param score - The credit score.
 */
const getCreditScoreColor = (score: number) => {
  if (score >= 800) return "#9b87f5"; // Excellent
  if (score >= 740) return "#31ED50"; // Very Good
  if (score >= 670) return "#6E59A5"; // Good
  if (score >= 580) return "#ea384c"; // Fair
  return "#1A1F2C"; // Poor
};

/**
 * Returns a text label based on the credit score value.
 * @param score - The credit score.
 */
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

  // Fetch data using custom hooks.
  const { data: expenses } = useExpenses();
  const { monthlyData: expenseData, spendingByCategory } = useMonthlyExpenses();
  const { monthlyData: incomeData } = useMonthlyIncome();
  const { data: goals } = useFinancialGoals();

  // State to store AI insights and a ref to prevent re-generation.
  const [aiInsights, setAiInsights] = useState<string>("");
  const insightsGeneratedRef = useRef(false);

  // Calculate current month expense, income, and monthly savings.
  const currentMonthExpense = expenseData[expenseData.length - 1]?.amount || 0;
  const currentMonthIncome = incomeData[0]?.amount || 0;
  const monthlySavings = currentMonthIncome - currentMonthExpense;

  // Calculate overall total balance.
  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const totalBalance = totalIncome - totalExpenses;

  // Use the first financial goal as the primary goal.
  const primaryGoal = goals?.[0];
  const goalProgress = primaryGoal
    ? (primaryGoal.current_amount / primaryGoal.target_amount) * 100
    : 0;

  // Component to display when no data is available.
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-lg text-gray-500 mb-4">No data available</p>
      <p className="text-sm text-gray-400">Start by adding some income or expenses</p>
    </div>
  );

  // Prepare data for the line chart (last 6 months).
  const lineChartData = expenseData.slice(0, 6).map((expense, index) => {
    const income = incomeData[index] || { amount: 0 };
    const balance = income.amount - expense.amount;
    return {
      month: expense.month,
      expense: expense.amount,
      balance: balance,
    };
  });

  // Calculate change in monthly savings between the last two months.
  const monthlySavingsChange =
    lineChartData.length > 1
      ? ((lineChartData[lineChartData.length - 1].balance -
          lineChartData[lineChartData.length - 2].balance) /
          lineChartData[lineChartData.length - 1].balance) *
        100
      : 0;

  // Calculate a balance change indicator based on current month’s balance vs. total.
  const balanceChange = ((lineChartData[lineChartData.length - 1]?.balance) / totalBalance) * 100;

  /**
   * Renders an arrow indicator for a given percentage change.
   * Returns an upward arrow for positive change and a downward arrow for negative change.
   * @param change - The percentage change.
   */
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

  // Hardcoded credit score for demo purposes (replace with real data as needed).
  const creditScore = 750;
  const creditScoreColor = getCreditScoreColor(creditScore);
  const creditScoreText = getCreditScoreText(creditScore);

  /**
   * Fetch AI insights from the server using Supabase functions.
   * This runs only once once the required data is available.
   */
  useEffect(() => {
    const getAiInsights = async () => {
      if (insightsGeneratedRef.current) return;

      try {
        // Retrieve the authenticated user.
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          console.error("No authenticated user found");
          toast({
            title: "Error",
            description: "Please log in to view insights",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        // Invoke the serverless function to analyze finances.
        const { data, error } = await supabase.functions.invoke("analyze-finances", {
          body: {
            type: "insights",
            userId: user.id,
            expenses: expenses || [],
            income: incomeData || [],
            goals: goals || [],
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

        // If insights are available, update the state.
        if (data?.suggestions) {
          setAiInsights(data.suggestions);
          insightsGeneratedRef.current = true;
        }
      } catch (error) {
        console.error("Error getting AI insights:", error);
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
    <div className="container mx-auto px-4 py-8 space-y-8 bg-gradient-to-br from-background to-surface">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Financial Dashboard
        </h1>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Balance */}
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light">Total Balance</p>
                <p className="text-2xl font-semibold text-primary">
                  ${totalBalance.toFixed(2)}
                  {getChangeIndicator(balanceChange)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <Wallet className="w-8 h-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Score */}
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light">Credit Score</p>
                <p className="text-2xl font-semibold" style={{ color: creditScoreColor }}>
                  {creditScore}
                </p>
                <p className="text-sm" style={{ color: creditScoreColor }}>
                  {creditScoreText}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: `${creditScoreColor}20` }}>
                <Award className="w-8 h-8" style={{ color: creditScoreColor }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Savings */}
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light">Monthly Savings</p>
                <p className="text-2xl font-semibold text-accent">
                  ${monthlySavings.toFixed(2)}
                  {getChangeIndicator(monthlySavingsChange)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-accent/10">
                <PiggyBank className="w-8 h-8 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Expenses */}
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light">Monthly Expenses</p>
                <p className="text-2xl font-semibold text-red-500">
                  ${currentMonthExpense.toFixed(2)}
                  {getChangeIndicator(expenseData[0]?.change || 0)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-500/10">
                <CreditCard className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Balance & Expenses Trend Chart */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">
              Balance & Expenses Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lineChartData.length > 0 ? (
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    balance: { color: "#0066CC" },
                    expense: { color: "#FF4444" },
                  }}
                >
                  <LineChart data={lineChartData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="var(--color-balance)"
                      strokeWidth={2}
                      dot={{ strokeWidth: 2 }}
                      name="Balance"
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      stroke="var(--color-expense)"
                      strokeWidth={2}
                      dot={{ strokeWidth: 2 }}
                      name="Expenses"
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                <p className="text-lg text-gray-500 mb-4">No data available yet</p>
                <p className="text-sm text-gray-400">Start by adding some transactions</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expenses by Category Pie Chart */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">
              Expenses by Category
            </CardTitle>
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
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(1)}%)`
                      }
                    >
                      {spendingByCategory.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
                    />
                  </PieChart>
                </ChartContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                <p className="text-lg text-gray-500 mb-4">No expense data available</p>
                <p className="text-sm text-gray-400">Start by adding some expenses</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights Card with Increased Font Size */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
              <Lightbulb className="w-5 h-5" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {aiInsights ? (
              <div className="space-y-4 p-4 bg-gradient-to-br from-primary/5 to-transparent rounded-lg">
                {/* Increased font size (text-lg) for better readability */}
                <p className="text-lg leading-relaxed text-text whitespace-pre-line">
                  {aiInsights}
                </p>
              </div>
            ) : (
              <div className="text-center text-text-light animate-pulse">
                Generating insights...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recurring Expenses Component */}
        <RecurringExpenses />

        {/* Financial Goal Progress Card */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
              <Target className="w-5 h-5" />
              Financial Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            {primaryGoal ? (
              <div className="space-y-4">
                <h3 className="font-medium text-text">{primaryGoal.name}</h3>
                <Progress value={goalProgress} className="h-2" />
                <div className="flex justify-between text-sm text-text-light">
                  <span>${primaryGoal.current_amount.toFixed(2)}</span>
                  <span>${primaryGoal.target_amount.toFixed(2)}</span>
                </div>
                <p className="text-sm text-text-light bg-accent/10 p-3 rounded-lg">
                  You're {goalProgress.toFixed(1)}% of the way to your goal
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                <p className="text-lg text-gray-500 mb-4">No goals set yet</p>
                <p className="text-sm text-gray-400">Start by setting a financial goal</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Health Score Card */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
              <Shield className="w-5 h-5" />
              Financial Health Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-transparent rounded-lg">
              <div
                className={`text-4xl font-bold mb-2 ${
                  monthlySavings > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {monthlySavings > 0 ? "Good" : "Needs Attention"}
              </div>
              <p className="text-sm text-text-light">
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
