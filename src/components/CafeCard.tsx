import React from "react";
import { Star, MapPin, Wifi, Zap, Volume2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { BookmarkButton } from "../components/BookmarkButton";
import { MotionDiv, MotionCard, MotionButton } from "../components/ui/motion";
import type { Cafe } from "../types/cafe";

const amenityIcons: Record<string, React.ReactNode> = {
  "high-speed-wifi": <Wifi className="h-3 w-3" />,
  "power-outlets": <Zap className="h-3 w-3" />,
  "quiet-zone": <Volume2 className="h-3 w-3" />,
};

type Props = {
  cafe: Cafe;
  showFullDescription?: boolean;
};

export function CafeCard({ cafe, showFullDescription }: Props) {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="overflow-hidden hover:shadow-cafe-lg dark:hover:shadow-cafe-dark-lg transition-all group"
    >
      <Card className="border-0 shadow-none bg-transparent">
        <div className="aspect-video relative overflow-hidden rounded-t-cafe">
          <MotionDiv
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src={cafe.images[0]}
              alt={cafe.name}
              className="object-cover w-full h-full"
            />
          </MotionDiv>
          <div className="absolute top-3 right-3">
            <BookmarkButton cafeId={cafe.id} />
          </div>
          {cafe.featured && (
            <MotionDiv
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="absolute top-3 left-3"
            >
              <Badge className="bg-primary text-primary-foreground shadow-menu dark:shadow-menu-dark">
                Featured
              </Badge>
            </MotionDiv>
          )}
        </div>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-serif font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {cafe.name}
            </h3>
            <div className="flex items-center space-x-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{cafe.rating}</span>
            </div>
          </div>
          <div className="flex items-center text-muted-foreground text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{cafe.address}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {showFullDescription
              ? cafe.description
              : `${cafe.description.slice(0, 100)}...`}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {cafe.amenities.slice(0, 3).map((amenity) => (
              <Badge
                key={amenity}
                variant="secondary"
                className="text-xs rounded-md shadow-sm flex items-center"
              >
                {amenityIcons[amenity]}
                <span className="ml-1 capitalize">
                  {amenity.replace("-", " ")}
                </span>
              </Badge>
            ))}
            {cafe.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs rounded-md">
                +{cafe.amenities.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <MotionButton
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button asChild className="w-full cafe-button font-medium">
              <a href={`/cafe/${cafe.slug}`}>View Details</a>
            </Button>
          </MotionButton>
        </CardFooter>
      </Card>
    </MotionCard>
  );
}
