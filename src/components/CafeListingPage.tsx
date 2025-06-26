import React, { useState, useMemo } from 'react';
import { CafeCard } from '../components/CafeCard';
import { SearchFilter } from '../components/SearchFilter';
import { LocationService } from '../components/LocationService';
import { SmartRecommendations } from '../components/SmartRecommendations';
import { MotionDiv, StaggeredContainer, LoadingSpinner } from '../components/ui/motion';
import { Separator } from '../components/ui/separator';
import type { FilterOptions, Cafe } from '../types/cafe';
import cafesData from '../data/cafes.json';

interface SmartRecommendation {
  cafe: Cafe;
  distance?: number;
  reason: string;
  priority: number;
  weatherMatch: boolean;
  timeMatch: boolean;
}

export function CafeListingPage() {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    amenities: [],
    minRating: 0,
  });
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(null);
  const [smartRecommendations, setSmartRecommendations] = useState<SmartRecommendation[]>([]);

  const filteredCafes = useMemo(() => {
    return cafesData.filter((cafe) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        if (
          !cafe.name.toLowerCase().includes(searchTerm) &&
          !cafe.address.toLowerCase().includes(searchTerm)
        ) {
          return false;
        }
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        if (!filters.amenities.every((amenity) => cafe.amenities.includes(amenity))) {
          return false;
        }
      }

      // Rating filter
      if (cafe.rating < filters.minRating) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Filter out recommended cafes from the main list to avoid duplicates
  const nonRecommendedCafes = useMemo(() => {
    if (!smartRecommendations.length) return filteredCafes;
    
    const recommendedIds = new Set(smartRecommendations.map(r => r.cafe.id));
    return filteredCafes.filter(cafe => !recommendedIds.has(cafe.id));
  }, [filteredCafes, smartRecommendations]);

  return (
    <div className="space-y-8">
      {/* Smart Location Service */}
      <LocationService 
        cafes={cafesData}
        onLocationUpdate={setUserLocation}
        onRecommendationsUpdate={setSmartRecommendations}
      />

      {/* Smart Recommendations */}
      {smartRecommendations.length > 0 && (
        <>
          <SmartRecommendations 
            recommendations={smartRecommendations}
            userLocation={userLocation}
          />
          <Separator className="my-8" />
        </>
      )}

      {/* Traditional Search and Filter */}
      <div>
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-6"
        >
          <h2 className="text-2xl font-serif font-bold mb-2">
            {smartRecommendations.length > 0 ? 'Browse All Cafés' : 'Find Your Perfect Café'}
          </h2>
          <p className="text-muted-foreground">
            {smartRecommendations.length > 0 
              ? 'Explore our complete collection of work-friendly cafés'
              : 'Browse our curated collection of work-friendly cafés and find your ideal workspace'
            }
          </p>
        </MotionDiv>

        <SearchFilter filters={filters} onFiltersChange={setFilters} />
        
        <MotionDiv
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-sm text-muted-foreground font-medium">
            Showing {nonRecommendedCafes.length} of {cafesData.length} cafés
            {smartRecommendations.length > 0 && (
              <span className="text-primary ml-1">
                ({smartRecommendations.length} personalized recommendations above)
              </span>
            )}
          </p>
        </MotionDiv>
        
        <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nonRecommendedCafes.map((cafe, index) => (
            <MotionDiv
              key={cafe.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1,
                ease: "easeOut" 
              }}
            >
              <CafeCard cafe={cafe} />
            </MotionDiv>
          ))}
        </StaggeredContainer>
        
        {nonRecommendedCafes.length === 0 && (
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <LoadingSpinner className="text-4xl" />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-3">No cafés found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              No cafés match your current filters. Try adjusting your search criteria.
            </p>
            <MotionDiv
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <button
                onClick={() => setFilters({ search: '', amenities: [], minRating: 0 })}
                className="text-primary hover:text-primary/80 font-medium transition-colors cafe-button px-4 py-2 rounded-cafe bg-primary/5 hover:bg-primary/10"
              >
                Clear all filters
              </button>
            </MotionDiv>
          </MotionDiv>
        )}
      </div>
    </div>
  );
}