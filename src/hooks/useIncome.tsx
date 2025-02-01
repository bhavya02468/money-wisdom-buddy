import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Income {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export const useIncome = () => {
  const fetchIncome = async () => {
    const { data, error } = await supabase
      .from("income")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching income:", error);
      throw error;
    }

    return data;
  };

  return useQuery({
    queryKey: ["income"],
    queryFn: fetchIncome,
  });
};

export const useMonthlyIncome = () => {
  const { data: income } = useIncome();

  if (!income) return { monthlyData: [], incomeByCategory: [] };

  // Group income by month and calculate totals
  const monthlyTotals = income.reduce<{ [key: string]: number }>((acc, entry) => {
    const date = new Date(entry.date);
    const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
    acc[monthYear] = (acc[monthYear] || 0) + entry.amount;
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

  // Calculate income by category for the current month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const currentMonthIncome = income.filter(entry => {
    const incomeDate = new Date(entry.date);
    return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
  });

  const categoryTotals = currentMonthIncome.reduce<{ [key: string]: number }>((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + entry.amount;
    return acc;
  }, {});

  const totalIncome = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  const incomeByCategory = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
    description: `${name} income`,
    percentage: Number(((value / totalIncome) * 100).toFixed(1)),
    change: 0
  }));

  // Calculate category changes from previous month
  const previousMonthIncome = income.filter(entry => {
    const incomeDate = new Date(entry.date);
    return incomeDate.getMonth() === (currentMonth - 1) && incomeDate.getFullYear() === currentYear;
  });

  const previousCategoryTotals = previousMonthIncome.reduce<{ [key: string]: number }>((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + entry.amount;
    return acc;
  }, {});

  // Update change values in incomeByCategory
  incomeByCategory.forEach(category => {
    const previousAmount = previousCategoryTotals[category.name] || category.value;
    const change = ((category.value - previousAmount) / previousAmount) * 100;
    category.change = Number(change.toFixed(1));
  });

  return {
    monthlyData: monthlyData.reverse(), // Most recent first
    incomeByCategory: incomeByCategory.sort((a, b) => b.value - a.value), // Sorted by value
  };
};