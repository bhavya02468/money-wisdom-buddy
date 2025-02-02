import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, userId, expenses, income, goals } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    // Prepare financial data for analysis
    const totalExpenses = expenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0) || 0
    const totalIncome = income?.reduce((sum: number, inc: any) => sum + inc.amount, 0) || 0
    const savings = totalIncome - totalExpenses
    const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0

    // Group expenses by category
    const expensesByCategory = expenses?.reduce((acc: any, exp: any) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount
      return acc
    }, {}) || {}

    // Prepare the prompt for OpenAI
    const prompt = `As a financial advisor, analyze this user's financial data and provide personalized suggestions:
    Total Monthly Income: $${totalIncome}
    Total Monthly Expenses: $${totalExpenses}
    Monthly Savings: $${savings}
    Savings Rate: ${savingsRate.toFixed(1)}%
    Expenses by Category: ${JSON.stringify(expensesByCategory)}
    Financial Goals: ${JSON.stringify(goals)}

    Based on this data, provide 3 specific, actionable financial suggestions. Focus on:
    1. Areas where they could reduce spending
    2. Ways to increase savings
    3. Progress towards their financial goals
    
    Keep the response concise and practical, with a focus on Montreal-specific advice where relevant.`

    // Get suggestions from OpenAI
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    })

    const suggestions = completion.data.choices[0]?.message?.content || 'Unable to generate suggestions at this time.'

    // Return the response with CORS headers
    return new Response(
      JSON.stringify({ suggestions }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
