import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FinancialGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
}

export const useFinancialGoals = () => {
  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from("financial_goals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching financial goals:", error);
      throw error;
    }

    return data;
  };

  return useQuery({
    queryKey: ["financial_goals"],
    queryFn: fetchGoals,
  });
};