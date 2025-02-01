import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Investments = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Investment Portfolio</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate("/stocks")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Stocks Portfolio
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate("/real-estate")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Real Estate Portfolio
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Investments;