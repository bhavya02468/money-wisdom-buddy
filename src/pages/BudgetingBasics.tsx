import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, DollarSign, PieChart, Calculator, BookOpen } from "lucide-react";
import { useState } from "react";

const BudgetingBasics = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const sections = [
    {
      id: "50-30-20",
      title: "The 50/30/20 Rule",
      icon: PieChart,
      content: "The 50/30/20 budget rule is a simple way to manage your money. It suggests that you should spend:\n\n• 50% of your income on needs (housing, food, utilities)\n• 30% on wants (entertainment, dining out)\n• 20% on savings and debt repayment",
      color: "text-primary"
    },
    {
      id: "tracking",
      title: "Expense Tracking",
      icon: Calculator,
      content: "Track every expense for at least a month to understand your spending patterns. Categories to monitor include:\n\n• Fixed expenses (rent, utilities)\n• Variable expenses (groceries, gas)\n• Discretionary spending (entertainment)\n• Savings and investments",
      color: "text-secondary"
    },
    {
      id: "emergency",
      title: "Emergency Fund",
      icon: DollarSign,
      content: "An emergency fund is your financial safety net. Aim to save:\n\n• 3-6 months of living expenses\n• Keep it in an easily accessible savings account\n• Only use it for true emergencies\n• Replenish it as soon as possible after use",
      color: "text-accent"
    },
    {
      id: "goals",
      title: "Setting Financial Goals",
      icon: BookOpen,
      content: "Set SMART financial goals:\n\n• Specific: Clear and well-defined\n• Measurable: Track your progress\n• Achievable: Realistic to accomplish\n• Relevant: Aligned with your values\n• Time-bound: Set deadlines",
      color: "text-green-500"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Budgeting Basics</h1>
            <p className="text-text-light text-lg">
              Master the fundamentals of personal budgeting with these essential concepts and practical tips.
            </p>
          </div>

          <div className="grid gap-6">
            {sections.map((section) => (
              <Card key={section.id} className="animate-fade-in">
                <Collapsible
                  open={openSections[section.id]}
                  onOpenChange={() => toggleSection(section.id)}
                >
                  <CardHeader className="cursor-pointer" onClick={() => toggleSection(section.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg bg-gray-100 ${section.color}`}>
                          <section.icon className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-xl">{section.title}</CardTitle>
                      </div>
                      <CollapsibleTrigger>
                        <ChevronDown
                          className={`w-6 h-6 transition-transform ${
                            openSections[section.id] ? "transform rotate-180" : ""
                          }`}
                        />
                      </CollapsibleTrigger>
                    </div>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent>
                      <p className="whitespace-pre-line text-text-light">
                        {section.content}
                      </p>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BudgetingBasics;