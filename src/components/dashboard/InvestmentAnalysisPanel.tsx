import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentAnalysis } from "@/lib/analyzers/investment-analyzer";

interface InvestmentAnalysisPanelProps {
  analysis: InvestmentAnalysis;
}

export function InvestmentAnalysisPanel({ analysis }: InvestmentAnalysisPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="comparables">Comparables</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>
          <TabsContent value="summary">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Investment Score</p>
                <p>{analysis.investmentScore.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">ROI</p>
                <p>{analysis.roi.toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Market Value</p>
                <p>{analysis.marketValue} zł</p>
              </div>
              <div>
                <p className="text-sm font-medium">Renovation Cost</p>
                <p>{analysis.renovationCost} zł</p>
              </div>
              <div>
                <p className="text-sm font-medium">Potential Rent</p>
                <p>{analysis.potentialRent} zł</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="comparables">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Price/m2</TableHead>
                  <TableHead>Distance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analysis.comparableProperties.map((prop) => (
                  <TableRow key={prop.address}>
                    <TableCell>{prop.address}</TableCell>
                    <TableCell>{prop.price} zł</TableCell>
                    <TableCell>{prop.pricePerM2} zł</TableCell>
                    <TableCell>{prop.distance.toFixed(2)} km</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="location">
            {/* Location analysis with map will be implemented here */}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
