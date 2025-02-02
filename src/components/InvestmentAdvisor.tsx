import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Stock {
  symbol: string;
  currentPrice: number;
  purchasePrice: number;
  change: number;
  name: string;
}

interface InvestmentAdvisorProps {
  stocks: Stock[];
}

export const InvestmentAdvisor = ({ stocks }: InvestmentAdvisorProps) => {
  const [advice, setAdvice] = useState<string>("");

  useEffect(() => {
    const getStockAdvice = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('analyze-finances', {
          body: { 
            type: 'stocks',
            stocks: stocks.map(stock => ({
              symbol: stock.symbol,
              currentPrice: stock.currentPrice,
              purchasePrice: stock.purchasePrice,
              change: stock.change
            }))
          },
        });

        if (error) throw error;
        if (data?.suggestions) {
          setAdvice(data.suggestions);
        }
      } catch (error) {
        console.error('Error getting stock advice:', error);
      }
    };

    getStockAdvice();
  }, [stocks]);

  if (!advice) return null;

  return (
    <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex items-start gap-4">
        <img
          src="/lovable-uploads/2cc60c20-704c-4e74-8ef7-0baba9ed0820.png"
          alt="AI Advisor"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="font-semibold text-lg mb-2">Investment Recommendations</h3>
          <div className="text-gray-700 space-y-2 whitespace-pre-line">
            {advice}
          </div>
        </div>
      </div>
    </Card>
  );
};