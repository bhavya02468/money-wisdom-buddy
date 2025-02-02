import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMonthlyIncome } from "@/hooks/useIncome";
import { useMonthlyExpenses } from "@/hooks/useExpenses";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AddInvestment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { monthlyData: incomeData } = useMonthlyIncome();
  const { monthlyData: expenseData } = useMonthlyExpenses();
  
  const [type, setType] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<string>("");

  // Calculate total balance
  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const totalBalance = totalIncome - totalExpenses;
  const suggestedAmount = totalBalance / 2;

  const getInvestmentRecommendation = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "Please log in to get investment recommendations",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/investment-advice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          investmentType: type,
          amount: parseFloat(amount),
          totalBalance,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get investment recommendation");
      }

      const data = await response.json();
      setRecommendation(data.recommendation);
    } catch (error) {
      console.error("Error getting investment recommendation:", error);
      toast({
        title: "Error",
        description: "Failed to get investment recommendation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Add Investment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="type">Investment Type</Label>
            <Select onValueChange={setType} value={type}>
              <SelectTrigger>
                <SelectValue placeholder="Select investment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="property">Property</SelectItem>
                <SelectItem value="stocks">Stocks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Investment Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Suggested amount: $${suggestedAmount.toFixed(2)}`}
            />
            <p className="text-sm text-muted-foreground">
              Your total balance: ${totalBalance.toFixed(2)}
            </p>
          </div>

          <Button
            onClick={getInvestmentRecommendation}
            disabled={!type || !amount || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Recommendation...
              </>
            ) : (
              "Get Investment Recommendation"
            )}
          </Button>

          {recommendation && (
            <div className="mt-4 p-4 bg-secondary rounded-lg">
              <h3 className="font-semibold mb-2">AI Recommendation:</h3>
              <p className="text-sm">{recommendation}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddInvestment;