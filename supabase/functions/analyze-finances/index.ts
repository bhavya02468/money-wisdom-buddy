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
    const { type, stocks, userId } = await req.json();

    if (type === 'stocks') {
      let suggestions = "Based on your portfolio analysis:\n\n";
      
      for (const stock of stocks) {
        const changePercent = ((stock.currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;
        
        if (changePercent <= -5) {
          suggestions += `${stock.symbol}: Consider buying more to average down. The current dip might be a good opportunity.\n`;
        } else if (changePercent >= 10) {
          suggestions += `${stock.symbol}: Consider taking some profits. The stock has performed well.\n`;
        } else {
          suggestions += `${stock.symbol}: Hold position. The stock is showing stable performance.\n`;
        }
      }

      return new Response(
        JSON.stringify({ suggestions }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!supabaseUrl || !supabaseServiceKey || !openAIApiKey) {
      throw new Error('Missing required environment variables');
    }

    console.log('Initializing Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Fetching user financial data...');
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

    console.log('Preparing Montreal-specific analysis prompt...');
    const analysisPrompt = `
      As a financial advisor familiar with Montreal downtown, analyze this data:
      - Monthly Income: $${totalIncome}
      - Monthly Expenses: $${totalExpenses}
      - Savings Rate: ${savingsRate.toFixed(1)}%
      - Expense Categories: ${JSON.stringify(expensesByCategory)}
      - Financial Goals: ${goals.map(g => `${g.name}: $${g.target_amount}`).join(', ')}

      Provide ONE specific, actionable suggestion (max 80 words) focusing on:
      1. Montreal-specific savings opportunities (e.g., STM OPUS card deals, student discounts)
      2. Local subscription alternatives (e.g., independent gym deals vs. chain gyms)
      3. Downtown Montreal budget tips (e.g., affordable lunch spots, happy hour deals)
      4. Seasonal money-saving opportunities in Montreal

      Keep the response very concise and practical, focusing on unique Montreal downtown opportunities.
    `;

    console.log('Calling OpenAI API...');
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
            content: 'You are a helpful financial advisor based in Montreal downtown. Provide specific, actionable advice based on real financial data and local opportunities.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 120,
      }),
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error('Failed to get AI suggestions');
    }

    const aiData = await aiResponse.json();
    const suggestions = aiData.choices[0].message.content;

    console.log('Successfully generated Montreal-specific suggestions');
    return new Response(
      JSON.stringify({ suggestions }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
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
