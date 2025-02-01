import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Building2 } from "lucide-react";

const Investments = () => {
  const stockInvestments = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      shares: 10,
      purchasePrice: 150.00,
      currentPrice: 175.25,
      totalValue: 1752.50
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      shares: 5,
      purchasePrice: 2800.00,
      currentPrice: 2950.75,
      totalValue: 14753.75
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      shares: 8,
      purchasePrice: 300.00,
      currentPrice: 325.50,
      totalValue: 2604.00
    }
  ];

  const realEstateProperties = [
    {
      address: "123 Maple Avenue",
      type: "Residential",
      purchasePrice: 350000,
      currentValue: 425000,
      rentalIncome: 2500,
      yearPurchased: 2020
    },
    {
      address: "456 Oak Street",
      type: "Commercial",
      purchasePrice: 750000,
      currentValue: 850000,
      rentalIncome: 5500,
      yearPurchased: 2019
    },
    {
      address: "789 Pine Road",
      type: "Multi-family",
      purchasePrice: 550000,
      currentValue: 650000,
      rentalIncome: 4000,
      yearPurchased: 2021
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Investment Portfolio</h1>
      
      {/* Stocks Section */}
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4">
          <LineChart className="w-8 h-8 text-primary" />
          <CardTitle>Stocks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Symbol</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-right p-2">Shares</th>
                  <th className="text-right p-2">Purchase Price</th>
                  <th className="text-right p-2">Current Price</th>
                  <th className="text-right p-2">Total Value</th>
                </tr>
              </thead>
              <tbody>
                {stockInvestments.map((stock, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{stock.symbol}</td>
                    <td className="p-2">{stock.name}</td>
                    <td className="text-right p-2">{stock.shares}</td>
                    <td className="text-right p-2">${stock.purchasePrice.toFixed(2)}</td>
                    <td className="text-right p-2">${stock.currentPrice.toFixed(2)}</td>
                    <td className="text-right p-2">${stock.totalValue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Real Estate Section */}
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4">
          <Building2 className="w-8 h-8 text-primary" />
          <CardTitle>Real Estate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {realEstateProperties.map((property, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{property.address}</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Type:</span> {property.type}</p>
                    <p><span className="font-medium">Purchase Price:</span> ${property.purchasePrice.toLocaleString()}</p>
                    <p><span className="font-medium">Current Value:</span> ${property.currentValue.toLocaleString()}</p>
                    <p><span className="font-medium">Monthly Rental Income:</span> ${property.rentalIncome}</p>
                    <p><span className="font-medium">Year Purchased:</span> {property.yearPurchased}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Investments;