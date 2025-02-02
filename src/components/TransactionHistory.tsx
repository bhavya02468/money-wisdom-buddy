import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Edit2, Trash2 } from "lucide-react";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface TransactionHistoryProps {
  data: Transaction[];
  type: "expense" | "income";
  categories: string[];
  onUpdate: () => void;
}

export const TransactionHistory = ({
  data,
  type,
  categories,
  onUpdate,
}: TransactionHistoryProps) => {
  const { toast } = useToast();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(
    null
  );

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from(type === "expense" ? "expenses" : "income")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${type === "expense" ? "Expense" : "Income"} deleted successfully`,
      });
      onUpdate();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast({
        title: "Error",
        description: `Failed to delete ${type}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTransaction) return;

    try {
      const { error } = await supabase
        .from(type === "expense" ? "expenses" : "income")
        .update({
          description: editingTransaction.description,
          amount: editingTransaction.amount,
          category: editingTransaction.category,
          date: editingTransaction.date,
        })
        .eq("id", editingTransaction.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${type === "expense" ? "Expense" : "Income"} updated successfully`,
      });
      setEditingTransaction(null);
      onUpdate();
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({
        title: "Error",
        description: `Failed to update ${type}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell>${transaction.amount.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingTransaction(transaction)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit {type}</DialogTitle>
                      </DialogHeader>
                      {editingTransaction && (
                        <form onSubmit={handleUpdate} className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Description</label>
                            <Input
                              value={editingTransaction.description}
                              onChange={(e) =>
                                setEditingTransaction({
                                  ...editingTransaction,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Amount</label>
                            <Input
                              type="number"
                              step="0.01"
                              value={editingTransaction.amount}
                              onChange={(e) =>
                                setEditingTransaction({
                                  ...editingTransaction,
                                  amount: parseFloat(e.target.value),
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Category</label>
                            <Select
                              value={editingTransaction.category}
                              onValueChange={(value) =>
                                setEditingTransaction({
                                  ...editingTransaction,
                                  category: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Date</label>
                            <Input
                              type="date"
                              value={editingTransaction.date.split("T")[0]}
                              onChange={(e) =>
                                setEditingTransaction({
                                  ...editingTransaction,
                                  date: e.target.value,
                                })
                              }
                            />
                          </div>
                          <Button type="submit" className="w-full">
                            Update {type}
                          </Button>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(transaction.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};