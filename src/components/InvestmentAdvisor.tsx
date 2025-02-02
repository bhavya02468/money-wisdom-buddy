import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowTrendingUp, ArrowTrendingDown, Minus } from "lucide-react";

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
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStockAnalysis = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('analyze-stocks', {
          body: { stocks },
        });

        if (error) throw error;
        
        if (data?.recommendations) {
          // Split recommendations into array and clean up
          const recArray = data.recommendations
            .split('\n')
            .filter((rec: string) => rec.trim().length > 0);
          setRecommendations(recArray);
        }
      } catch (error) {
        console.error('Error getting stock analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    getStockAnalysis();
  }, [stocks]);

  const getRecommendationIcon = (rec: string) => {
    if (rec.startsWith('BUY')) return <ArrowTrendingUp className="w-6 h-6 text-green-500" />;
    if (rec.startsWith('SELL')) return <ArrowTrendingDown className="w-6 h-6 text-red-500" />;
    return <Minus className="w-6 h-6 text-yellow-500" />;
  };

  if (loading) {
    return (
      <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Analyzing your portfolio...</div>
        </div>
      </Card>
    );
  }

  if (!recommendations.length) return null;

  return (
    <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex items-start gap-4">
        <img
          src="/lovable-uploads/2cc60c20-704c-4e74-8ef7-0baba9ed0820.png"
          alt="AI Advisor"
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-4">Trading Recommendations</h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                {getRecommendationIcon(rec)}
                <p className="text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};