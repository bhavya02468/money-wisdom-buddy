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
    const { investmentType, riskLevel, amount, totalBalance, userId } = await req.json();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let prompt = '';
    if (investmentType === 'property') {
      prompt = `As a financial advisor, provide a detailed ${riskLevel} investment recommendation for a property investment of $${amount} in downtown Montreal (which is ${((amount/totalBalance)*100).toFixed(1)}% of their total balance of $${totalBalance}). 

Format your response in this structure:
1. Investment Strategy (${riskLevel} approach)
2. Specific Areas to Consider in Downtown Montreal
3. Property Types to Focus On
4. Expected Returns and Timeline
5. Key Risks to Consider
6. Additional Recommendations

Keep the response professional but easy to understand. Focus on current market conditions and practical next steps.`;
    } else {
      prompt = `As a financial advisor, provide a detailed ${riskLevel} investment recommendation for a ${investmentType} investment of $${amount} (which is ${((amount/totalBalance)*100).toFixed(1)}% of their total balance of $${totalBalance}). 

Format your response in this structure:
1. Investment Strategy (${riskLevel} approach)
2. Specific Recommendations
3. Expected Returns
4. Risk Analysis
5. Timeline Considerations
6. Additional Tips

Keep the response professional but easy to understand. Focus on practical next steps.`;
    }

    console.log('Generating investment advice with prompt:', prompt);

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
            content: 'You are a knowledgeable financial advisor providing investment recommendations. Be clear, concise, and always consider both risk and potential returns in your advice. Format your responses in a structured, easy-to-read way.',
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
    const recommendation = data.choices[0].message.content;

    console.log('Generated recommendation:', recommendation);

    return new Response(
      JSON.stringify({ recommendation }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in investment-advice function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});