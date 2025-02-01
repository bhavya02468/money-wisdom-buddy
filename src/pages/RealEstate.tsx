import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const properties = [
  {
    id: 1,
    address: "123 Main Street, New York, NY",
    type: "Residential",
    value: 500000,
    monthlyRent: 2500,
    occupancyStatus: "Occupied",
  },
  {
    id: 2,
    address: "456 Park Avenue, Los Angeles, CA",
    type: "Commercial",
    value: 1200000,
    monthlyRent: 8000,
    occupancyStatus: "Vacant",
  },
];

const RealEstate = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Real Estate Portfolio</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map((property) => (
          <Card key={property.id}>
            <CardHeader>
              <CardTitle className="text-lg">{property.address}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><span className="font-semibold">Type:</span> {property.type}</p>
                <p><span className="font-semibold">Value:</span> ${property.value.toLocaleString()}</p>
                <p><span className="font-semibold">Monthly Rent:</span> ${property.monthlyRent.toLocaleString()}</p>
                <p><span className="font-semibold">Status:</span> {property.occupancyStatus}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RealEstate;