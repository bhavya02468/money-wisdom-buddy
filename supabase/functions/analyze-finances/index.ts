import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, userId, expenses, income, goals } = await req.json();

    if (type === 'insights') {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

      if (!supabaseUrl || !supabaseServiceKey || !openAIApiKey) {
        throw new Error('Missing required environment variables');
      }

      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const [expensesResponse, incomeResponse, goalsResponse] = await Promise.all([
        supabase.from('expenses').select('*').eq('user_id', userId),
        supabase.from('income').select('*').eq('user_id', userId),
        supabase.from('financial_goals').select('*').eq('user_id', userId)
      ]);

      if (expensesResponse.error) throw expensesResponse.error;
      if (incomeResponse.error) throw incomeResponse.error;
      if (goalsResponse.error) throw goalsResponse.error;

      const expenses = expensesResponse.data || [];
      const income = incomeResponse.data || [];
      const goals = goalsResponse.data || [];

      const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
      const totalIncome = income.reduce((sum, inc) => sum + Number(inc.amount), 0);
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
      
      const expensesByCategory = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
        return acc;
      }, {} as Record<string, number>);

      const recurringExpenses = expenses.filter(exp => exp.is_recurring);
      const totalRecurring = recurringExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

      const analysisPrompt = `
        As a financial advisor, analyze this data and provide 3 specific suggestions (max 80 words total):
        Monthly Income: $${totalIncome}
        Monthly Expenses: $${totalExpenses}
        Savings Rate: ${savingsRate.toFixed(1)}%
        Recurring Expenses: $${totalRecurring}
        Expense Categories: ${JSON.stringify(expensesByCategory)}
        Financial Goals: ${goals.map(g => `${g.name}: $${g.target_amount}`).join(', ')}

        Focus on:
        1. Savings opportunities
        2. Budget optimization
        3. Goal achievement
      `;

      const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful financial advisor. Provide specific, actionable advice based on real financial data. Keep responses under 80 words and avoid using markdown symbols.'
            },
            {
              role: 'user',
              content: analysisPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 150,
        }),
      });

      if (!aiResponse.ok) {
        console.error('OpenAI API error:', await aiResponse.text());
        throw new Error('Failed to get AI suggestions');
      }

      const aiData = await aiResponse.json();
      const suggestions = aiData.choices[0].message.content;

      return new Response(
        JSON.stringify({ suggestions }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid request type' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});