import { useState } from "react";
import { useFinancialGoals } from "@/hooks/useFinancialGoals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Target, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const FinancialGoals = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: goals } = useFinancialGoals();
  const [loading, setLoading] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    target_amount: "",
    target_date: "",
  });

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase.from("financial_goals").insert({
        user_id: user.id,
        name: newGoal.name,
        target_amount: parseFloat(newGoal.target_amount),
        target_date: newGoal.target_date,
        current_amount: 0,
      });

      if (error) throw error;

      toast({
        title: "Goal Added",
        description: "Your financial goal has been added successfully.",
      });

      setNewGoal({ name: "", target_amount: "", target_date: "" });
      queryClient.invalidateQueries({ queryKey: ["financial_goals"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add financial goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from("financial_goals")
        .delete()
        .eq("id", goalId);

      if (error) throw error;

      toast({
        title: "Goal Deleted",
        description: "Your financial goal has been deleted successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ["financial_goals"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete financial goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProgress = async (goalId: string, newAmount: string) => {
    try {
      const amount = parseFloat(newAmount);
      if (isNaN(amount)) return;

      const { error } = await supabase
        .from("financial_goals")
        .update({ current_amount: amount })
        .eq("id", goalId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["financial_goals"] });
      toast({
        title: "Progress Updated",
        description: "Goal progress has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 bg-gradient-to-br from-background to-surface">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Financial Goals
        </h1>
      </div>


      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Add New Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Goal Name</label>
                  <Input
                    required
                    value={newGoal.name}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, name: e.target.value })
                    }
                    placeholder="e.g., Emergency Fund"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Target Amount ($)
                  </label>
                  <Input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={newGoal.target_amount}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, target_amount: e.target.value })
                    }
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Target Date
                  </label>
                  <Input
                    required
                    type="date"
                    value={newGoal.target_date}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, target_date: e.target.value })
                    }
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Goal"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: List of Goals */}
        <div className="lg:w-1/2 grid gap-6">
          {goals && goals.length > 0 ? (
            goals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      {goal.name}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>
                        Progress: ${goal.current_amount} of ${goal.target_amount}
                      </span>
                      <span>
                        Target Date:{" "}
                        {new Date(goal.target_date).toLocaleDateString()}
                      </span>
                    </div>
                    <Progress
                      value={(goal.current_amount / goal.target_amount) * 100}
                      className="h-2"
                    />
                    <div className="flex gap-4 items-center">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Update progress"
                        onChange={(e) =>
                          handleUpdateProgress(goal.id, e.target.value)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-24 text-center">
                <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">No Financial Goals Yet</p>
                <p className="text-sm text-gray-500">
                  Start by adding your first financial goal on the left.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialGoals;
