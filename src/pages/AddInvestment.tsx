import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useExpenses } from "@/hooks/useExpenses";
import { useMonthlyIncome } from "@/hooks/useIncome";

const AddInvestment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [type, setType] = useState<"property" | "stocks" | "">("");
  const [amount, setAmount] = useState("");
  const { monthlyData: expenseData } = useExpenses();
  const { monthlyData: incomeData } = useMonthlyIncome();

  // Calculate total balance
  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const totalBalance = totalIncome - totalExpenses;
  const suggestedAmount = totalBalance / 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!type || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Navigate to investments page after submission
    toast({
      title: "Success",
      description: "Investment plan created successfully",
    });
    navigate("/investments");
  };

  const getSuggestion = () => {
    if (!type) return "";
    
    const riskySuggestion = `Risky Investment (Higher Returns): Consider investing up to $${suggestedAmount.toFixed(2)} in ${type === "stocks" ? "growth stocks or cryptocurrency" : "real estate development or commercial properties"}. Potential returns: 15-25% annually, but with higher risk.`;
    
    const safeSuggestion = `Safe Investment (Stable Returns): Consider investing up to $${(suggestedAmount * 0.7).toFixed(2)} in ${type === "stocks" ? "blue-chip stocks or ETFs" : "residential rental properties"}. Potential returns: 5-10% annually, with lower risk.`;

    return (
      <div className="mt-4 space-y-4 text-sm">
        <p className="text-green-600">{riskySuggestion}</p>
        <p className="text-blue-600">{safeSuggestion}</p>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Investment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="type">Investment Type</Label>
              <Select
                value={type}
                onValueChange={(value: "property" | "stocks") => setType(value)}
              >
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
                placeholder="Enter amount"
              />
              <p className="text-sm text-muted-foreground">
                Available Balance: ${totalBalance.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                Suggested Investment Amount: ${suggestedAmount.toFixed(2)} (50% of balance)
              </p>
            </div>

            {type && getSuggestion()}

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit">Add Investment</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddInvestment;