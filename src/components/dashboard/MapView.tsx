import { Card, CardContent } from "@/components/ui/card";

interface MapViewProps {
  className?: string;
}

export function MapView({ className }: MapViewProps) {
  return (
    <Card className={className}>
      <CardContent>
        <div className="h-96 w-full bg-gray-200 flex items-center justify-center">
          <p>Map View Placeholder</p>
        </div>
      </CardContent>
    </Card>
  );
}
