import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

interface MonthlyData {
  month: string;
  amount: number;
  change: number;
}

interface FinancialGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, expenses, income, goals } = await req.json();

    if (!userId) {
      throw new Error('User ID is required');
    }

    console.log('Processing financial data for user:', userId);
    console.log('Data received:', { expenses, income, goals });

    // Calculate financial metrics
    const totalExpenses = expenses?.reduce((sum: number, exp: MonthlyData) => sum + exp.amount, 0) || 0;
    const totalIncome = income?.reduce((sum: number, inc: MonthlyData) => sum + inc.amount, 0) || 0;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // Generate insights based on the data
    let suggestions = "Based on your financial data:\n\n";

    if (savingsRate < 20) {
      suggestions += "• Consider reviewing your monthly expenses to increase your savings rate.\n";
    } else {
      suggestions += "• Great job maintaining a healthy savings rate!\n";
    }

    if (goals?.length > 0) {
      const primaryGoal = goals[0] as FinancialGoal;
      const progress = (primaryGoal.current_amount / primaryGoal.target_amount) * 100;
      suggestions += `• You're ${progress.toFixed(1)}% towards your ${primaryGoal.name} goal.\n`;
    }

    if (expenses?.length > 1) {
      const currentMonth = expenses[0].amount;
      const previousMonth = expenses[1].amount;
      const change = ((currentMonth - previousMonth) / previousMonth) * 100;
      
      if (change > 0) {
        suggestions += `• Your expenses increased by ${Math.abs(change).toFixed(1)}% compared to last month. Consider areas where you can cut back.\n`;
      } else {
        suggestions += `• Your expenses decreased by ${Math.abs(change).toFixed(1)}% compared to last month. Keep up the good work!\n`;
      }
    }

    console.log('Generated suggestions:', suggestions);

    return new Response(
      JSON.stringify({ suggestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in analyze-finances function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});