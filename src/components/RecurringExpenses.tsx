import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenses } from "@/hooks/useExpenses";

export const RecurringExpenses = () => {
  const { data: expenses } = useExpenses();

  // Filter for last month's recurring expenses
  const currentDate = new Date();
  const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
  
  const recurringExpenses = expenses?.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expense.is_recurring && 
           expenseDate.getMonth() === lastMonth.getMonth() &&
           expenseDate.getFullYear() === lastMonth.getFullYear();
  }) || [];

  if (recurringExpenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recurring Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            No recurring expenses found for last month
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recurring Expenses</CardTitle>
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
                <p className="text-sm text-muted-foreground">{expense.category}</p>
              </div>
              <p className="font-medium text-red-500">
                -${expense.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};