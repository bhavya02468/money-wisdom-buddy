import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMonthlyExpenses } from "@/hooks/useExpenses";

export const RecurringExpenses = () => {
  const { monthlyData: expenseData } = useMonthlyExpenses();
  
  const recurringExpenses = expenseData
    .filter((expense) => expense.is_recurring)
    .slice(0, 5); // Show only the last 5 recurring expenses

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recurring Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recurringExpenses.length > 0 ? (
            recurringExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-2 rounded-lg bg-secondary/10"
              >
                <div>
                  <p className="font-medium">{expense.description}</p>
                  <p className="text-sm text-muted-foreground">{expense.category}</p>
                </div>
                <p className="font-medium text-red-500">
                  -${expense.amount.toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center">No recurring expenses found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};