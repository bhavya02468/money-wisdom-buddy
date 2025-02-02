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

      // Calculate subscription expenses
      const subscriptionExpenses = expenses.filter(exp => 
        exp.description.toLowerCase().includes('subscription') || 
        exp.description.toLowerCase().includes('monthly') ||
        exp.is_recurring
      );

      const totalSubscriptions = subscriptionExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
      
      // Group expenses by category for analysis
      const expensesByCategory = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
        return acc;
      }, {} as Record<string, number>);

      const analysisPrompt = `
        As a financial advisor, analyze this data and provide 3 specific suggestions for reducing expenses (max 80 words total).
        Focus on:
        1. Monthly Subscriptions (Total: $${totalSubscriptions})
        2. Expense Categories: ${JSON.stringify(expensesByCategory)}
        3. Recurring Expenses: ${JSON.stringify(subscriptionExpenses.map(e => ({ name: e.description, amount: e.amount })))}

        Consider:
        - Popular subscription alternatives or bundles
        - Categories with highest spending
        - Specific opportunities for cost reduction
        
        Format response as:
        1. [First suggestion about subscriptions]
        2. [Second suggestion about high-spend categories]
        3. [Third suggestion about general savings]
      `;

      console.log('Sending analysis prompt to OpenAI:', analysisPrompt);

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
              content: 'You are a helpful financial advisor. Provide specific, actionable advice for reducing expenses. Focus on subscription optimization and practical money-saving tips. Keep responses under 80 words and use a clear numbered list format.'
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});