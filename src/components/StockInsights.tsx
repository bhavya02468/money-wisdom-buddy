import { Card } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Stock {
  symbol: string;
  currentPrice: number;
  purchasePrice: number;
  change: number;
  name: string;
}

interface StockInsightsProps {
  stocks: Stock[];
}

export const StockInsights = ({ stocks }: StockInsightsProps) => {
  const [advice, setAdvice] = useState<string>("");
  const insightsGeneratedRef = useRef(false);

  useEffect(() => {
    const getStockAdvice = async () => {
      if (insightsGeneratedRef.current) return;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error('No authenticated user found');
          return;
        }

        const { data, error } = await supabase.functions.invoke('analyze-finances', {
          body: { 
            type: 'stocks',
            userId: user.id,
            stocks: stocks.map(stock => ({
              symbol: stock.symbol,
              currentPrice: stock.currentPrice,
              purchasePrice: stock.purchasePrice,
              change: stock.change,
              name: stock.name
            }))
          },
        });

        if (error) throw error;
        if (data?.suggestions) {
          setAdvice(data.suggestions);
          insightsGeneratedRef.current = true;
        }
      } catch (error) {
        console.error('Error getting stock advice:', error);
      }
    };

    getStockAdvice();
  }, [stocks]);

  if (!advice) return null;

  return (
    <Card className="p-6 mb-8 bg-white shadow-lg">
      <div className="flex items-start gap-4">
        <img
          src="/lovable-uploads/2cc60c20-704c-4e74-8ef7-0baba9ed0820.png"
          alt="AI Advisor"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="font-semibold text-lg mb-2">Investment Insights</h3>
          <div className="text-gray-700 space-y-2 whitespace-pre-line">
            {advice}
          </div>
        </div>
      </div>
    </Card>
  );
};