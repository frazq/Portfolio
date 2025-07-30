import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface FiltersPanelProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
}

interface PropertyFilters {
  priceRange: [number, number];
  cityIds: string[];
  minROI: number;
  minInvestmentScore: number;
  propertyTypes: PropertyType[];
  maxRenovationCost: number;
  sortBy: 'score' | 'price' | 'roi' | 'date';
}

enum PropertyType {
    MIESZKANIE,
    DOM,
    LOKAL
}

export function FiltersPanel({ filters, onFiltersChange }: FiltersPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Price Range</Label>
          <Slider
            defaultValue={filters.priceRange}
            onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value as [number, number] })}
            max={10000000}
            step={10000}
          />
        </div>
        <div>
          <Label>Min ROI</Label>
          <Slider
            defaultValue={[filters.minROI]}
            onValueChange={(value) => onFiltersChange({ ...filters, minROI: value[0] })}
            max={20}
            step={0.5}
          />
        </div>
        <div>
          <Label>Min Investment Score</Label>
          <Slider
            defaultValue={[filters.minInvestmentScore]}
            onValueChange={(value) => onFiltersChange({ ...filters, minInvestmentScore: value[0] })}
            max={100}
            step={1}
          />
        </div>
        <div>
          <Label>Property Types</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="mieszkanie" />
              <Label htmlFor="mieszkanie">Mieszkanie</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="dom" />
              <Label htmlFor="dom">Dom</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="lokal" />
              <Label htmlFor="lokal">Lokal</Label>
            </div>
          </div>
        </div>
        <Button>Apply Filters</Button>
      </CardContent>
    </Card>
  );
}
