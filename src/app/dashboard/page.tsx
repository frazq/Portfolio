import { FiltersPanel } from "@/components/dashboard/FiltersPanel";
import { InvestmentAnalysisPanel } from "@/components/dashboard/InvestmentAnalysisPanel";
import { MapView } from "@/components/dashboard/MapView";
import { PropertyCard } from "@/components/dashboard/PropertyCard";

function DashboardHeader() {
  return <header className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <h1 className="text-lg font-semibold text-gray-900">
        Real Estate Scanner
      </h1>
    </div>
  </header>
}

function PropertiesList() {
    // This will be replaced with a dynamic list of properties
    return <div className="space-y-4">
        <PropertyCard property={{
            id: "1",
            title: "Example Property",
            price: 500000,
            address: "123 Main St",
            analysis: {
                investmentScore: 85,
                roi: 6.5,
                marketValue: 550000,
                renovationCost: 20000,
                potentialRent: 3000,
                riskLevel: "LOW",
                reasons: [],
                comparableProperties: []
            }
        }} onSaveToFavorites={() => {}} onCreateAlert={() => {}} />
    </div>
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Filters sidebar */}
          <div className="col-span-3">
            <FiltersPanel filters={{
                priceRange: [0, 10000000],
                cityIds: [],
                minROI: 0,
                minInvestmentScore: 0,
                propertyTypes: [],
                maxRenovationCost: 0,
                sortBy: "score"
            }} onFiltersChange={() => {}} />
          </div>

          {/* Main content */}
          <div className="col-span-6">
            <div className="space-y-4">
              <PropertiesList />
            </div>
          </div>

          {/* Analysis panel */}
          <div className="col-span-3">
            <InvestmentAnalysisPanel analysis={{
                investmentScore: 85,
                roi: 6.5,
                marketValue: 550000,
                renovationCost: 20000,
                potentialRent: 3000,
                riskLevel: "LOW",
                reasons: [],
                comparableProperties: []
            }} />
          </div>
        </div>

        {/* Map view toggle */}
        <MapView className="mt-6" />
      </div>
    </div>
  );
}
