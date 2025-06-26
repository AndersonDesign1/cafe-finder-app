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
  import("../components/InteractiveMap").then((m) => ({
    default: m.InteractiveMap,
  }))
);

export function MapPage() {
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    amenities: [],
    minRating: 0,
  });
  const [selectedCafe, setSelectedCafe] = useState<string | null>(null);

  const filteredCafes = useMemo(
    () =>
      cafesData.filter((cafe) => {
        if (filters.search) {
          const s = filters.search.toLowerCase();
          if (
            !cafe.name.toLowerCase().includes(s) &&
            !cafe.address.toLowerCase().includes(s)
          )
            return false;
        }
        if (
          filters.amenities.length &&
          !filters.amenities.every((a) => cafe.amenities.includes(a))
        )
          return false;
        if (cafe.rating < filters.minRating) return false;
        return true;
      }),
    [filters]
  );

  const stats = useMemo(() => {
    const stateDist = cafesData.reduce((acc, cafe) => {
      const state = cafe.address.split(",").pop()?.trim() || "Unknown";
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const avgRating =
      cafesData.reduce((sum, c) => sum + c.rating, 0) / cafesData.length;
    return {
      total: cafesData.length,
      filtered: filteredCafes.length,
      avgRating: avgRating.toFixed(1),
      featured: cafesData.filter((c) => c.featured).length,
      states: Object.keys(stateDist).length,
      stateDist,
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
        {[
          {
            icon: <Coffee className="h-5 w-5 text-primary" />,
            value: stats.filtered,
            label:
              stats.filtered === stats.total
                ? "Total Cafés"
                : `of ${stats.total} Cafés`,
          },
          {
            icon: <MapPin className="h-5 w-5 text-primary" />,
            value: stats.states,
            label: "States",
          },
          {
            icon: <Star className="h-5 w-5 text-primary" />,
            value: stats.avgRating,
            label: "Avg Rating",
          },
          {
            icon: <Users className="h-5 w-5 text-primary" />,
            value: stats.featured,
            label: "Featured",
          },
        ].map((s, i) => (
          <Card key={i} className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                {s.icon}
              </div>
              <div className="text-2xl font-bold text-card-foreground">
                {s.value}
              </div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
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
            {Object.entries(stats.stateDist)
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
            {[
              {
                color: "bg-blue-500",
                size: "w-8 h-8",
                label: "Featured Cafés",
                desc: "Premium locations with excellent ratings",
              },
              {
                color: "bg-green-500",
                size: "w-6 h-6",
                label: "Regular Cafés",
                desc: "Great workspaces with good amenities",
              },
            ].map((f, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div
                  className={`${f.size} ${f.color} rounded-full flex items-center justify-center text-white text-sm shadow-lg border-2 border-white`}
                >
                  ☕
                </div>
                <div>
                  <div className="font-medium text-foreground">{f.label}</div>
                  <div className="text-sm text-muted-foreground">{f.desc}</div>
                </div>
              </div>
            ))}
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
