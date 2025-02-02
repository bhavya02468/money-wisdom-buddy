import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, userId, expenses, income, goals } = await req.json();
    console.log('Analyzing finances for user:', userId);
    console.log('Data received:', { expenses, income, goals });

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Prepare the data for analysis
    const totalExpenses = expenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0) || 0;
    const totalIncome = income?.reduce((sum: number, inc: any) => sum + inc.amount, 0) || 0;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    
    // Group expenses by category
    const expensesByCategory = expenses?.reduce((acc: any, exp: any) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {}) || {};

    const prompt = `As a financial advisor, analyze this user's financial data and provide personalized suggestions:

Total Income: $${totalIncome}
Total Expenses: $${totalExpenses}
Savings Rate: ${savingsRate.toFixed(1)}%

Expense Breakdown by Category:
${Object.entries(expensesByCategory)
  .map(([category, amount]) => `${category}: $${amount}`)
  .join('\n')}

Financial Goals:
${goals?.map((goal: any) => 
  `- ${goal.name}: $${goal.current_amount}/$${goal.target_amount}`
).join('\n') || 'No goals set'}

Based on this data, provide 3-4 specific, actionable suggestions for improving their financial well-being. Focus on:
1. Spending patterns and potential savings
2. Progress towards financial goals
3. Budgeting recommendations
4. Investment opportunities if relevant

Format the response in clear, simple language without using any markdown symbols (* or #).`;

    console.log('Sending request to OpenAI...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a helpful financial advisor providing personalized insights based on user data. Keep suggestions practical and actionable.',
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error response:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const data = await response.json();
    console.log('Successfully received OpenAI response');
    
    return new Response(
      JSON.stringify({ suggestions: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-finances function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});