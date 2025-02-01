import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, DollarSign, PieChart, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Learn = () => {
  const resources = [
    {
      title: "Budgeting Basics",
      description: "Learn how to create and maintain a personal budget that works for you.",
      icon: DollarSign,
      color: "text-primary",
    },
    {
      title: "Investment Fundamentals",
      description: "Understand different investment options and strategies for long-term growth.",
      icon: PieChart,
      color: "text-secondary",
    },
    {
      title: "Debt Management",
      description: "Strategies for managing and reducing debt effectively.",
      icon: Shield,
      color: "text-accent",
    },
    {
      title: "Retirement Planning",
      description: "Plan for your future with comprehensive retirement strategies.",
      icon: BookOpen,
      color: "text-green-500",
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Financial Education Resources</h1>
          
          <div className="grid gap-6">
            {resources.map((resource, index) => (
              <Link key={index} to={`/learn/${resource.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className={`p-2 rounded-lg bg-gray-100 ${resource.color}`}>
                      <resource.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{resource.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-light">{resource.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Learn;