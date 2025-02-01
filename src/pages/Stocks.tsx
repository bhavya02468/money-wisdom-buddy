import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Stocks = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Stocks Portfolio</h1>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The stocks portfolio feature is currently under development.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stocks;