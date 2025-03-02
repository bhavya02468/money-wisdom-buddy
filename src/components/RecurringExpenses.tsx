import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenses } from "@/hooks/useExpenses";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  is_recurring: boolean;
}

export const RecurringExpenses = () => {
  const { data: expenses } = useExpenses();
  
  // Filter for recurring expenses and get last 6
  const recurringExpenses = expenses
    ?.filter((expense: Expense) => expense.is_recurring)
    .sort((a: Expense, b: Expense) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Recurring Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recurringExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-2 rounded-lg bg-secondary/10"
            >
              <div>
                <p className="font-medium">{expense.description}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(expense.date).toLocaleDateString()} - {expense.category}
                </p>
              </div>
              <p className="font-medium text-red-500">
                -${expense.amount.toFixed(2)}
              </p>
            </div>
          ))}
          {recurringExpenses.length === 0 && (
            <div className="text-center text-muted-foreground">
              No recurring expenses found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};