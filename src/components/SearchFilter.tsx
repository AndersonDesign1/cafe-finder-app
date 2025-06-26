import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { MotionDiv, MotionButton } from "../components/ui/motion";
import type { FilterOptions } from "../types/cafe";

interface SearchFilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const amenityOptions = [
  { id: "high-speed-wifi", label: "High-Speed WiFi" },
  { id: "power-outlets", label: "Power Outlets" },
  { id: "quiet-zone", label: "Quiet Zone" },
  { id: "meeting-rooms", label: "Meeting Rooms" },
  { id: "coffee-bar", label: "Coffee Bar" },
  { id: "food-menu", label: "Food Menu" },
  { id: "outdoor-seating", label: "Outdoor Seating" },
  { id: "parking", label: "Parking" },
];

export function SearchFilter({ filters, onFiltersChange }: SearchFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search });
  };

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    const newAmenities = checked
      ? [...filters.amenities, amenityId]
      : filters.amenities.filter((id) => id !== amenityId);
    onFiltersChange({ ...filters, amenities: newAmenities });
  };

  const handleRatingChange = (value: number[]) => {
    onFiltersChange({ ...filters, minRating: value[0] });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      amenities: [],
      minRating: 0,
    });
  };

  const hasActiveFilters =
    filters.search || filters.amenities.length > 0 || filters.minRating > 0;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col sm:flex-row gap-4 mb-6"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search cafés or locations..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 rounded-cafe border-border/50 bg-card/50 backdrop-blur-sm shadow-menu dark:shadow-menu-dark transition-all duration-300 focus:shadow-cafe dark:focus:shadow-cafe-dark"
        />
      </div>

      <div className="flex gap-2">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <MotionButton
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Button
                variant="outline"
                className="flex items-center gap-2 cafe-button relative"
              >
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <MotionDiv
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-3 h-3 flex items-center justify-center text-xs"
                  >
                    <div className="w-2 h-2 bg-current rounded-full" />
                  </MotionDiv>
                )}
              </Button>
            </MotionButton>
          </SheetTrigger>
          <SheetContent className="z-50 bg-card/95 backdrop-blur-md border-border/50">
            {" "}
            <SheetHeader>
              <SheetTitle className="font-serif">Filter Cafés</SheetTitle>
              <SheetDescription>
                Refine your search to find the perfect workspace
              </SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <MotionDiv
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Label className="text-base font-medium mb-4 block font-serif">
                  Minimum Rating: {filters.minRating.toFixed(1)}
                </Label>
                <Slider
                  value={[filters.minRating]}
                  onValueChange={handleRatingChange}
                  max={5}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </MotionDiv>

              <MotionDiv
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Label className="text-base font-medium mb-4 block font-serif">
                  Amenities
                </Label>
                <div className="space-y-3">
                  {amenityOptions.map((amenity, index) => (
                    <MotionDiv
                      key={amenity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 + index * 0.05 }}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={amenity.id}
                        checked={filters.amenities.includes(amenity.id)}
                        onCheckedChange={(checked) =>
                          handleAmenityChange(amenity.id, checked as boolean)
                        }
                        className="rounded-sm"
                      />
                      <Label
                        htmlFor={amenity.id}
                        className="text-sm font-normal cursor-pointer hover:text-primary transition-colors"
                      >
                        {amenity.label}
                      </Label>
                    </MotionDiv>
                  ))}
                </div>
              </MotionDiv>
            </div>
            {hasActiveFilters && (
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="border-t pt-4"
              >
                <MotionButton
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full flex items-center gap-2 cafe-button"
                  >
                    <X className="h-4 w-4" />
                    Clear All Filters
                  </Button>
                </MotionButton>
              </MotionDiv>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </MotionDiv>
  );
}
