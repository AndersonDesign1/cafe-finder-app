import React from "react";
import {
  MapPin,
  Navigation2,
  Star,
  Thermometer,
  Clock,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  MotionDiv,
  MotionButton,
  StaggeredContainer,
} from "../components/ui/motion";
import type { Cafe } from "../types/cafe";

type SmartRecommendation = {
  cafe: Cafe;
  distance?: number;
  reason: string;
  priority: number;
  weatherMatch: boolean;
  timeMatch: boolean;
};

type Props = {
  recommendations: SmartRecommendation[];
  userLocation: GeolocationPosition | null;
};

const formatDistance = (d: number) =>
  d < 1 ? `${Math.round(d * 1000)}m away` : `${d.toFixed(1)}km away`;

const getDirections = (
  cafe: Cafe,
  userLocation: GeolocationPosition | null
) => {
  if (!userLocation) return;
  const url = `https://www.google.com/maps/dir/${userLocation.coords.latitude},${userLocation.coords.longitude}/${cafe.coordinates.lat},${cafe.coordinates.lng}`;
  window.open(url, "_blank");
};

const getPriorityBadge = (priority: number) => {
  if (priority >= 50)
    return <Badge className="bg-green-500 text-white">Perfect Match</Badge>;
  if (priority >= 35)
    return <Badge className="bg-blue-500 text-white">Great Choice</Badge>;
  if (priority >= 20) return <Badge variant="secondary">Good Option</Badge>;
  return null;
};

export function SmartRecommendations({ recommendations, userLocation }: Props) {
  if (!recommendations.length) return null;
  const [top, ...others] = recommendations;

  return (
    <div className="space-y-6">
      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-serif font-bold mb-2">
            <Zap className="inline h-6 w-6 text-primary mr-2" />
            Smart Recommendations
          </h2>
          <p className="text-muted-foreground">
            Personalized suggestions based on your location, weather, and time
          </p>
        </div>
      </MotionDiv>

      {/* Top Recommendation */}
      <MotionDiv
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="border-primary/30 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 shadow-cafe-lg dark:shadow-cafe-dark-lg">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl font-serif flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  Top Pick for You
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Our AI thinks this is your perfect match right now
                </p>
              </div>
              {getPriorityBadge(top.priority)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="aspect-video w-24 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={top.cafe.images[0]}
                  alt={top.cafe.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-semibold text-lg mb-1">
                  {top.cafe.name}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="truncate">{top.cafe.address}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{top.cafe.rating}</span>
                  </div>
                  {top.distance && (
                    <div className="flex items-center text-primary">
                      <Navigation2 className="h-4 w-4 mr-1" />
                      <span className="font-medium">
                        {formatDistance(top.distance)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm font-medium text-foreground mb-2">
                Why we recommend this:
              </p>
              <p className="text-sm text-muted-foreground">{top.reason}</p>
              <div className="flex gap-2 mt-3">
                {top.weatherMatch && (
                  <Badge variant="outline" className="text-xs">
                    <Thermometer className="h-3 w-3 mr-1" />
                    Weather Match
                  </Badge>
                )}
                {top.timeMatch && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    Perfect Timing
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <MotionButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button asChild className="w-full cafe-button">
                  <a href={`/cafe/${top.cafe.slug}`}>View Details</a>
                </Button>
              </MotionButton>
              <MotionButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  onClick={() => getDirections(top.cafe, userLocation)}
                  className="cafe-button"
                >
                  <Navigation2 className="h-4 w-4 mr-1" />
                  Directions
                </Button>
              </MotionButton>
            </div>
          </CardContent>
        </Card>
      </MotionDiv>

      {/* Other Recommendations */}
      {others.length > 0 && (
        <div>
          <h3 className="font-serif text-lg font-semibold mb-4">
            More Great Options
          </h3>
          <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {others.slice(0, 3).map((rec, i) => (
              <MotionDiv
                key={rec.cafe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
              >
                <Card className="hover:shadow-cafe-lg dark:hover:shadow-cafe-dark-lg transition-all group">
                  <CardContent className="p-4">
                    <div className="aspect-video rounded-lg overflow-hidden mb-3">
                      <img
                        src={rec.cafe.images[0]}
                        alt={rec.cafe.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-serif font-semibold truncate">
                          {rec.cafe.name}
                        </h4>
                        {getPriorityBadge(rec.priority)}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{rec.cafe.rating}</span>
                        </div>
                        {rec.distance && (
                          <div className="flex items-center text-primary">
                            <Navigation2 className="h-4 w-4 mr-1" />
                            <span className="font-medium">
                              {formatDistance(rec.distance)}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {rec.reason}
                      </p>
                      <div className="flex gap-1 pt-2">
                        <MotionButton
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1"
                        >
                          <Button
                            asChild
                            size="sm"
                            className="w-full text-xs cafe-button"
                          >
                            <a href={`/cafe/${rec.cafe.slug}`}>View</a>
                          </Button>
                        </MotionButton>
                        <MotionButton
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              getDirections(rec.cafe, userLocation)
                            }
                            className="cafe-button"
                          >
                            <Navigation2 className="h-3 w-3" />
                          </Button>
                        </MotionButton>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </MotionDiv>
            ))}
          </StaggeredContainer>
        </div>
      )}
    </div>
  );
}
