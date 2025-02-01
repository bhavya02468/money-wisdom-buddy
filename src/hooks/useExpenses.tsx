import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface CategorySpending {
  name: string;
  value: number;
  description: string;
  percentage: number;
  change: number;  // Added this to the interface
}

export const useExpenses = () => {
  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching expenses:", error);
      throw error;
    }

    return data;
  };

  return useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
  });
};

export const useMonthlyExpenses = () => {
  const { data: expenses } = useExpenses();

  if (!expenses) return { monthlyData: [], spendingByCategory: [] };

  // Group expenses by month and calculate totals
  const monthlyTotals = expenses.reduce<{ [key: string]: number }>((acc, expense) => {
    const date = new Date(expense.date);
    const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
    acc[monthYear] = (acc[monthYear] || 0) + expense.amount;
    return acc;
  }, {});

  // Calculate month-over-month changes
  const monthlyData = Object.entries(monthlyTotals).map(([month, amount], index, array) => {
    const prevAmount = index > 0 ? array[index - 1][1] : amount;
    const change = ((amount - prevAmount) / prevAmount) * 100;
    return {
      month,
      amount,
      change: Number(change.toFixed(1))
    };
  });

  // Calculate total spending by category (for all time)
  const categoryTotals = expenses.reduce<{ [key: string]: number }>((acc, expense) => {
    const category = expense.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {});

  const totalSpent = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  // Transform category totals into the format needed for the pie chart
  const spendingByCategory: CategorySpending[] = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
    description: `${name} expenses`,
    percentage: Number(((value / totalSpent) * 100).toFixed(1)),
    change: 0  // Initialize with 0, will update later
  }));

  // Sort categories by value (highest to lowest)
  spendingByCategory.sort((a, b) => b.value - a.value);

  // Calculate category changes from previous month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const previousMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === (currentMonth - 1) && expenseDate.getFullYear() === currentYear;
  });

  const previousCategoryTotals = previousMonthExpenses.reduce<{ [key: string]: number }>((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  // Update change values in spendingByCategory
  spendingByCategory.forEach(category => {
    const previousAmount = previousCategoryTotals[category.name] || 0;
    const currentAmount = category.value;
    const change = previousAmount === 0 ? 0 : ((currentAmount - previousAmount) / previousAmount) * 100;
    category.change = Number(change.toFixed(1));
  });

  return {
    monthlyData: monthlyData.reverse(), // Most recent first
    spendingByCategory, // Sorted by value
  };
};