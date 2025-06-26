import React, { useState, useMemo, lazy, Suspense } from "react";
import { SearchFilter } from "../components/SearchFilter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { MapPin, Coffee, Star, Users, Info } from "lucide-react";
import type { FilterOptions, Cafe } from "../types/cafe";
import cafesData from "../data/cafes.json";

const InteractiveMap = lazy(() =>
  import("../components/InteractiveMap").then((module) => ({
    default: module.InteractiveMap,
  }))
);

export function MapPage() {
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    amenities: [],
    minRating: 0,
  });
  const [selectedCafe, setSelectedCafe] = useState<string | null>(null);

  const filteredCafes = useMemo(() => {
    return cafesData.filter((cafe) => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        if (
          !cafe.name.toLowerCase().includes(searchTerm) &&
          !cafe.address.toLowerCase().includes(searchTerm)
        ) {
          return false;
        }
      }
      if (filters.amenities.length > 0) {
        if (
          !filters.amenities.every((amenity) =>
            cafe.amenities.includes(amenity)
          )
        ) {
          return false;
        }
      }
      if (cafe.rating < filters.minRating) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const stats = useMemo(() => {
    const stateDistribution = cafesData.reduce((acc, cafe) => {
      const state = cafe.address.split(",").pop()?.trim() || "Unknown";
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgRating =
      cafesData.reduce((sum, cafe) => sum + cafe.rating, 0) / cafesData.length;
    const featuredCount = cafesData.filter((cafe) => cafe.featured).length;

    return {
      total: cafesData.length,
      filtered: filteredCafes.length,
      avgRating: avgRating.toFixed(1),
      featured: featuredCount,
      states: Object.keys(stateDistribution).length,
      stateDistribution,
    };
  }, [filteredCafes.length]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Café Locations Map
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore work-friendly cafés across Nigeria. Click on markers to view
          details, get directions, and find your perfect workspace.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Coffee className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-card-foreground">
              {stats.filtered}
            </div>
            <div className="text-sm text-muted-foreground">
              {stats.filtered === stats.total
                ? "Total Cafés"
                : `of ${stats.total} Cafés`}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-card-foreground">
              {stats.states}
            </div>
            <div className="text-sm text-muted-foreground">States</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-card-foreground">
              {stats.avgRating}
            </div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-card-foreground">
              {stats.featured}
            </div>
            <div className="text-sm text-muted-foreground">Featured</div>
          </CardContent>
        </Card>
      </div>

      <SearchFilter filters={filters} onFiltersChange={setFilters} />

      <Suspense
        fallback={
          <Card className="border-border bg-card">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-card-foreground">Loading map...</span>
              </div>
            </CardContent>
          </Card>
        }
      >
        <div className="relative z-0">
          <InteractiveMap
            cafes={filteredCafes}
            selectedCafe={selectedCafe}
            onCafeSelect={setSelectedCafe}
          />
        </div>
      </Suspense>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-card-foreground">
            <MapPin className="h-5 w-5" />
            <span>Location Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(stats.stateDistribution)
              .sort(([, a], [, b]) => b - a)
              .map(([state, count]) => (
                <div
                  key={state}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <span className="font-medium text-sm text-foreground">
                    {state}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground"
                  >
                    {count}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Map Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm shadow-lg border-2 border-white">
                ☕
              </div>
              <div>
                <div className="font-medium text-foreground">
                  Featured Cafés
                </div>
                <div className="text-sm text-muted-foreground">
                  Premium locations with excellent ratings
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs shadow-lg border-2 border-white">
                ☕
              </div>
              <div>
                <div className="font-medium text-foreground">Regular Cafés</div>
                <div className="text-sm text-muted-foreground">
                  Great workspaces with good amenities
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-muted rounded-lg border border-border">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <div className="font-medium text-foreground mb-1">
                  Map Controls:
                </div>
                <ul className="space-y-1">
                  <li>• Use mouse wheel to zoom, drag to pan</li>
                  <li>
                    • Click the theme button (🌙/☀️) to toggle dark/light mode
                  </li>
                  <li>• Click the fullscreen button (⛶) for better viewing</li>
                  <li>• Markers cluster automatically when zoomed out</li>
                  <li>
                    • Click any marker to view café details and get directions
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
