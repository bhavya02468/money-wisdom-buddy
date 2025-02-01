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
    const { userId } = await req.json();
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!;

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch user's financial data
    const { data: expenses } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId);

    const { data: income } = await supabase
      .from('income')
      .select('*')
      .eq('user_id', userId);

    const { data: goals } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('user_id', userId);

    // Calculate key metrics
    const totalExpenses = expenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;
    const totalIncome = income?.reduce((sum, inc) => sum + Number(inc.amount), 0) || 0;
    const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
    
    // Group expenses by category
    const expensesByCategory = expenses?.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
      return acc;
    }, {} as Record<string, number>);

    // Prepare the analysis prompt
    const analysisPrompt = `
      As a financial advisor, analyze this user's financial data:
      - Monthly Income: $${totalIncome}
      - Monthly Expenses: $${totalExpenses}
      - Savings Rate: ${savingsRate.toFixed(1)}%
      - Expense Categories: ${JSON.stringify(expensesByCategory)}
      - Financial Goals: ${goals?.map(g => `${g.name}: $${g.target_amount}`).join(', ')}

      Based on this data, provide 2-3 specific, actionable suggestions to help them save money and achieve their financial goals. 
      Keep the response concise and practical. Focus on their highest expenses and areas with the most potential for savings.
    `;

    // Get AI suggestions
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
            content: 'You are a helpful financial advisor. Provide specific, actionable advice based on real financial data.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.7,
      }),
    });

    const aiData = await aiResponse.json();
    const suggestions = aiData.choices[0].message.content;

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