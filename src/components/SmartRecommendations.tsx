import React from 'react';
import { MapPin, Clock, Thermometer, Star, Navigation2, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { MotionDiv, MotionButton, StaggeredContainer } from '../components/ui/motion';
import type { Cafe } from '../types/cafe';

interface SmartRecommendation {
  cafe: Cafe;
  distance?: number;
  reason: string;
  priority: number;
  weatherMatch: boolean;
  timeMatch: boolean;
}

interface SmartRecommendationsProps {
  recommendations: SmartRecommendation[];
  userLocation: GeolocationPosition | null;
}

export function SmartRecommendations({ recommendations, userLocation }: SmartRecommendationsProps) {
  if (!recommendations.length) {
    return null;
  }

  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    }
    return `${distance.toFixed(1)}km away`;
  };

  const getDirections = (cafe: Cafe) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.coords.latitude},${userLocation.coords.longitude}/${cafe.coordinates.lat},${cafe.coordinates.lng}`;
      window.open(url, '_blank');
    }
  };

  const getPriorityBadge = (priority: number) => {
    if (priority >= 50) {
      return <Badge className="bg-green-500 text-white">Perfect Match</Badge>;
    } else if (priority >= 35) {
      return <Badge className="bg-blue-500 text-white">Great Choice</Badge>;
    } else if (priority >= 20) {
      return <Badge variant="secondary">Good Option</Badge>;
    }
    return null;
  };

  const topRecommendation = recommendations[0];
  const otherRecommendations = recommendations.slice(1, 4);

  return (
    <div className="space-y-6">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-serif font-bold mb-2">
            <Zap className="inline h-6 w-6 text-primary mr-2" />
            Smart Recommendations
          </h2>
          <p className="text-muted-foreground">
            Personalized suggestions based on your location, weather, and current time
          </p>
        </div>
      </MotionDiv>

      {/* Top Recommendation - Featured */}
      <MotionDiv
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
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
              {getPriorityBadge(topRecommendation.priority)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="aspect-video w-24 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={topRecommendation.cafe.images[0]}
                  alt={topRecommendation.cafe.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-semibold text-lg mb-1">
                  {topRecommendation.cafe.name}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="truncate">{topRecommendation.cafe.address}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{topRecommendation.cafe.rating}</span>
                  </div>
                  {topRecommendation.distance && (
                    <div className="flex items-center text-primary">
                      <Navigation2 className="h-4 w-4 mr-1" />
                      <span className="font-medium">{formatDistance(topRecommendation.distance)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm font-medium text-foreground mb-2">
                Why we recommend this:
              </p>
              <p className="text-sm text-muted-foreground">
                {topRecommendation.reason}
              </p>
              <div className="flex gap-2 mt-3">
                {topRecommendation.weatherMatch && (
                  <Badge variant="outline" className="text-xs">
                    <Thermometer className="h-3 w-3 mr-1" />
                    Weather Match
                  </Badge>
                )}
                {topRecommendation.timeMatch && (
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
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex-1"
              >
                <Button asChild className="w-full cafe-button">
                  <a href={`/cafe/${topRecommendation.cafe.slug}`}>
                    View Details
                  </a>
                </Button>
              </MotionButton>
              <MotionButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Button 
                  variant="outline" 
                  onClick={() => getDirections(topRecommendation.cafe)}
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
      {otherRecommendations.length > 0 && (
        <div>
          <h3 className="font-serif text-lg font-semibold mb-4">More Great Options</h3>
          <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherRecommendations.map((recommendation, index) => (
              <MotionDiv
                key={recommendation.cafe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  ease: "easeOut" 
                }}
              >
                <Card className="hover:shadow-cafe-lg dark:hover:shadow-cafe-dark-lg transition-all duration-300 group">
                  <CardContent className="p-4">
                    <div className="aspect-video rounded-lg overflow-hidden mb-3">
                      <img
                        src={recommendation.cafe.images[0]}
                        alt={recommendation.cafe.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-serif font-semibold truncate">
                          {recommendation.cafe.name}
                        </h4>
                        {getPriorityBadge(recommendation.priority)}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{recommendation.cafe.rating}</span>
                        </div>
                        {recommendation.distance && (
                          <div className="flex items-center text-primary">
                            <Navigation2 className="h-4 w-4 mr-1" />
                            <span className="font-medium">{formatDistance(recommendation.distance)}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {recommendation.reason}
                      </p>
                      
                      <div className="flex gap-1 pt-2">
                        <MotionButton
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="flex-1"
                        >
                          <Button asChild size="sm" className="w-full text-xs cafe-button">
                            <a href={`/cafe/${recommendation.cafe.slug}`}>
                              View
                            </a>
                          </Button>
                        </MotionButton>
                        <MotionButton
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => getDirections(recommendation.cafe)}
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