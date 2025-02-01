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
    const { message, chatHistory } = await req.json();
    console.log('Received message:', message);
    console.log('Chat history length:', chatHistory.length);

    // Convert chat history to OpenAI format
    const messages = [
      {
        role: "system",
        content: "You are a friendly and knowledgeable AI financial advisor. Provide clear, concise advice about personal finance, investments, budgeting, and financial planning. Keep responses focused and practical.",
      },
      ...chatHistory.map((msg: { type: string; content: string }) => ({
        role: msg.type === "assistant" ? "assistant" : "user",
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    console.log('Making request to OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',  // Using a more cost-effective model
        messages,
        temperature: 0.7,
        max_tokens: 150,  // Limiting response length to reduce token usage
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error response:', errorText);
      
      // Check if it's a quota error
      if (errorText.includes('insufficient_quota')) {
        throw new Error('OpenAI API quota exceeded. Please check your billing details or try again later.');
      }
      
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const data = await response.json();
    console.log('Successfully received OpenAI response');
    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chat-with-ai function:', error);
    
    // Provide a more user-friendly error message
    const userMessage = error.message.includes('insufficient_quota')
      ? "I'm currently unable to respond due to technical limitations. Please try again later."
      : "I apologize, but I'm having trouble responding right now. Please try again later.";

    return new Response(
      JSON.stringify({ 
        error: error.message,
        userMessage 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});