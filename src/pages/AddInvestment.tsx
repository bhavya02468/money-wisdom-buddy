import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useExpenses } from "@/hooks/useExpenses";
import { useIncome } from "@/hooks/useIncome";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const InvestmentRecommender = () => {
  const { toast } = useToast();
  const { data: expenses } = useExpenses();
  const { monthlyData: incomeData } = useIncome();
  const [loading, setLoading] = useState(false);
  const [investmentType, setInvestmentType] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [recommendation, setRecommendation] = useState<string>("");

  // Calculate total balance (income - expenses)
  const totalIncome = incomeData?.reduce((sum, item) => sum + item.amount, 0) || 0;
  const totalExpenses = expenses?.reduce((sum, item) => sum + item.amount, 0) || 0;
  const totalBalance = totalIncome - totalExpenses;
  const suggestedAmount = Math.max(0, totalBalance / 2);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow positive numbers
    if (Number(value) >= 0) {
      setAmount(value);
    }
  };

  const getInvestmentAdvice = async () => {
    if (Number(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a positive investment amount",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please log in to get investment advice",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('investment-advice', {
        body: { 
          investmentType,
          amount: parseFloat(amount),
          totalBalance,
          userId: user.id
        },
      });

      if (error) throw error;

      if (data?.recommendation) {
        setRecommendation(data.recommendation);
        toast({
          title: "Success",
          description: "Investment advice generated successfully",
        });
      }
    } catch (error) {
      console.error('Error getting investment advice:', error);
      toast({
        title: "Error",
        description: "Failed to get investment advice",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Investment Recommender</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Your total balance: ${totalBalance.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              Suggested investment amount: ${suggestedAmount.toFixed(2)} (50% of your balance)
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Investment Type</label>
              <Select onValueChange={setInvestmentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select investment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="stocks">Stocks</SelectItem>
                  <SelectItem value="bonds">Bonds</SelectItem>
                  <SelectItem value="cryptocurrency">Cryptocurrency</SelectItem>
                  <SelectItem value="mutual_funds">Mutual Funds</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Investment Amount ($)</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter amount"
                value={amount}
                onChange={handleAmountChange}
              />
            </div>

            <Button
              onClick={getInvestmentAdvice}
              disabled={!investmentType || !amount || loading || Number(amount) <= 0}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Advice...
                </>
              ) : (
                'Get Investment Advice'
              )}
            </Button>
          </div>

          {recommendation && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Investment Recommendations:</h3>
              <div className="whitespace-pre-line text-sm">
                {recommendation}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentRecommender;