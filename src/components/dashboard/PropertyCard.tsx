import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Property } from "@prisma/client";
import { InvestmentAnalysis } from "@/lib/analyzers/investment-analyzer";

interface PropertyCardProps {
  property: Property & {
    analysis: InvestmentAnalysis;
  };
  onSaveToFavorites: (id: string) => void;
  onCreateAlert: (id: string) => void;
}

export function PropertyCard({ property, onSaveToFavorites, onCreateAlert }: PropertyCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{property.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <div>
            <p className="text-lg font-bold">{property.price} zł</p>
            <p className="text-sm text-gray-500">{property.address}</p>
          </div>
          <Badge variant={property.analysis.investmentScore > 70 ? "default" : "secondary"}>
            {property.analysis.investmentScore.toFixed(2)}
          </Badge>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">ROI</p>
            <p>{property.analysis.roi.toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-sm font-medium">Market Value</p>
            <p>{property.analysis.marketValue} zł</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => onSaveToFavorites(property.id)}>
          Save
        </Button>
        <Button onClick={() => onCreateAlert(property.id)}>Alert</Button>
      </CardFooter>
    </Card>
  );
}
