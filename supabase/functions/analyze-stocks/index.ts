import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { stocks } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const stocksAnalysis = stocks.map(stock => 
      `${stock.symbol} (${stock.name}): Current price $${stock.currentPrice}, Purchase price $${stock.purchasePrice}, Change ${stock.change}%`
    ).join('\n');

    const prompt = `As a financial advisor, analyze these stocks and provide clear buy/sell/hold recommendations for each:

${stocksAnalysis}

For each stock, provide a one-line recommendation starting with either BUY, SELL, or HOLD in capital letters, followed by a brief explanation.
Keep each recommendation under 50 words and focus on the price movement and current market position.
Be very concise and direct with your recommendations.`;

    console.log('Analyzing stocks with prompt:', prompt);

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
            content: 'You are a professional stock market analyst providing clear and concise trading recommendations. Keep responses under 50 words per recommendation.',
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get OpenAI response');
    }

    const data = await response.json();
    const recommendations = data.choices[0].message.content;

    console.log('Generated recommendations:', recommendations);

    return new Response(
      JSON.stringify({ recommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-stocks function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});