import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Cloud, Sun, CloudRain, SunSnow as Snow, Thermometer } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { MotionDiv, MotionButton } from '../components/ui/motion';
import type { Cafe } from '../types/cafe';

interface LocationServiceProps {
  cafes: Cafe[];
  onLocationUpdate: (location: GeolocationPosition | null) => void;
  onRecommendationsUpdate: (recommendations: SmartRecommendation[]) => void;
}

interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  icon: string;
}

interface SmartRecommendation {
  cafe: Cafe;
  distance?: number;
  reason: string;
  priority: number;
  weatherMatch: boolean;
  timeMatch: boolean;
}

const WEATHER_API_KEY = 'demo'; // In production, use environment variable

export function LocationService({ cafes, onLocationUpdate, onRecommendationsUpdate }: LocationServiceProps) {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentTime = () => {
    const now = new Date();
    return {
      hour: now.getHours(),
      day: now.getDay(), // 0 = Sunday, 1 = Monday, etc.
      dayName: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()]
    };
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
      return <CloudRain className="h-4 w-4" />;
    } else if (lowerCondition.includes('snow')) {
      return <Snow className="h-4 w-4" />;
    } else if (lowerCondition.includes('cloud')) {
      return <Cloud className="h-4 w-4" />;
    } else {
      return <Sun className="h-4 w-4" />;
    }
  };

  const isCurrentlyOpen = (cafe: Cafe): boolean => {
    const { hour, dayName } = getCurrentTime();
    const todayHours = cafe.hours[dayName];
    
    if (!todayHours || todayHours === 'Closed') return false;
    
    try {
      const [openTime, closeTime] = todayHours.split(' - ').map(time => {
        const [hourStr, period] = time.trim().split(' ');
        const [hourNum] = hourStr.split(':').map(Number);
        let adjustedHour = hourNum;
        if (period === 'PM' && hourNum !== 12) adjustedHour += 12;
        if (period === 'AM' && hourNum === 12) adjustedHour = 0;
        return adjustedHour;
      });
      
      return hour >= openTime && hour <= closeTime;
    } catch {
      return true; // Default to open if parsing fails
    }
  };

  const generateSmartRecommendations = (userLocation: GeolocationPosition, weatherData: WeatherData | null): SmartRecommendation[] => {
    const { hour } = getCurrentTime();
    const userLat = userLocation.coords.latitude;
    const userLng = userLocation.coords.longitude;

    const recommendations: SmartRecommendation[] = cafes.map(cafe => {
      const distance = calculateDistance(userLat, userLng, cafe.coordinates.lat, cafe.coordinates.lng);
      let reason = '';
      let priority = 0;
      let weatherMatch = false;
      let timeMatch = false;

      // Distance-based scoring
      if (distance < 2) {
        priority += 30;
        reason = 'Very close to you';
      } else if (distance < 5) {
        priority += 20;
        reason = 'Nearby location';
      } else if (distance < 10) {
        priority += 10;
        reason = 'Within reasonable distance';
      }

      // Time-based recommendations
      if (hour >= 6 && hour < 10) {
        // Morning recommendations
        if (cafe.amenities.includes('coffee-bar')) {
          priority += 15;
          timeMatch = true;
          reason = reason ? `${reason} • Perfect for morning coffee` : 'Great morning coffee spot';
        }
      } else if (hour >= 10 && hour < 14) {
        // Late morning/lunch recommendations
        if (cafe.amenities.includes('food-menu')) {
          priority += 10;
          timeMatch = true;
          reason = reason ? `${reason} • Good for lunch meetings` : 'Ideal for lunch and work';
        }
      } else if (hour >= 14 && hour < 18) {
        // Afternoon recommendations
        if (cafe.amenities.includes('quiet-zone')) {
          priority += 12;
          timeMatch = true;
          reason = reason ? `${reason} • Quiet afternoon workspace` : 'Perfect afternoon focus spot';
        }
      } else {
        // Evening recommendations
        if (cafe.amenities.includes('events-space') || cafe.amenities.includes('outdoor-seating')) {
          priority += 8;
          timeMatch = true;
          reason = reason ? `${reason} • Great evening atmosphere` : 'Nice evening hangout';
        }
      }

      // Weather-based recommendations
      if (weatherData) {
        const temp = weatherData.temperature;
        const condition = weatherData.condition.toLowerCase();

        if (condition.includes('rain') || condition.includes('storm')) {
          if (cafe.amenities.includes('parking') || cafe.amenities.includes('meeting-rooms')) {
            priority += 15;
            weatherMatch = true;
            reason = reason ? `${reason} • Covered parking for rainy weather` : 'Perfect shelter from the rain';
          }
        } else if (temp > 25 && cafe.amenities.includes('outdoor-seating')) {
          priority += 10;
          weatherMatch = true;
          reason = reason ? `${reason} • Great weather for outdoor seating` : 'Perfect weather for outdoor work';
        } else if (temp < 15) {
          if (cafe.amenities.includes('coffee-bar')) {
            priority += 8;
            weatherMatch = true;
            reason = reason ? `${reason} • Warm up with great coffee` : 'Cozy spot to warm up';
          }
        }
      }

      // Featured cafes get bonus points
      if (cafe.featured) {
        priority += 10;
      }

      // High-rated cafes get bonus points
      if (cafe.rating >= 4.7) {
        priority += 8;
      } else if (cafe.rating >= 4.5) {
        priority += 5;
      }

      // Currently open cafes get priority
      if (isCurrentlyOpen(cafe)) {
        priority += 20;
        reason = reason ? `${reason} • Open now` : 'Currently open';
      } else {
        priority -= 10;
        reason = reason ? `${reason} • Currently closed` : 'Currently closed';
      }

      return {
        cafe,
        distance,
        reason,
        priority,
        weatherMatch,
        timeMatch
      };
    });

    // Sort by priority and return top recommendations
    return recommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 8);
  };

  const fetchWeather = async (lat: number, lng: number) => {
    try {
      // Mock weather data for demo - in production, use a real weather API
      const mockWeatherData: WeatherData = {
        temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
        condition: ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
        description: 'Pleasant weather for café visits',
        icon: 'clear'
      };
      
      setWeather(mockWeatherData);
      return mockWeatherData;
    } catch (error) {
      console.error('Weather fetch failed:', error);
      return null;
    }
  };

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocation(position);
        onLocationUpdate(position);
        
        // Fetch weather for the location
        const weatherData = await fetchWeather(position.coords.latitude, position.coords.longitude);
        
        // Generate smart recommendations
        const recommendations = generateSmartRecommendations(position, weatherData);
        onRecommendationsUpdate(recommendations);
        
        setIsLoading(false);
      },
      (error) => {
        setError(`Location access denied: ${error.message}`);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const getTimeBasedGreeting = () => {
    const { hour } = getCurrentTime();
    if (hour < 10) return 'Good morning! ☀️';
    if (hour < 14) return 'Good afternoon! 🌤️';
    if (hour < 18) return 'Good afternoon! ☀️';
    return 'Good evening! 🌙';
  };

  return (
    <div className="space-y-4">
      {!location ? (
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Navigation className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-2">
                    {getTimeBasedGreeting()}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Let us find the perfect café for you based on your location, current weather, and time of day.
                  </p>
                </div>
                <MotionButton
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <Button 
                    onClick={requestLocation} 
                    disabled={isLoading}
                    size="lg"
                    className="cafe-button shadow-cafe dark:shadow-cafe-dark"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                        Finding your location...
                      </>
                    ) : (
                      <>
                        <MapPin className="h-5 w-5 mr-2" />
                        Get Smart Recommendations
                      </>
                    )}
                  </Button>
                </MotionButton>
                {error && (
                  <p className="text-destructive text-sm mt-2">{error}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </MotionDiv>
      ) : (
        <MotionDiv
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">
                      Location found!
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Smart recommendations active
                    </p>
                  </div>
                </div>
                
                {weather && (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-sm">
                      {getWeatherIcon(weather.condition)}
                      <span className="font-medium">{weather.temperature}°C</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {weather.condition}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </MotionDiv>
      )}
    </div>
  );
}