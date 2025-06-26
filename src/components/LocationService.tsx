import React, { useState } from "react";
import {
  MapPin,
  Navigation,
  Cloud,
  Sun,
  CloudRain,
  SunSnow as Snow,
  Thermometer,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { MotionDiv, MotionButton } from "../components/ui/motion";
import type { Cafe } from "../types/cafe";

type WeatherData = {
  temperature: number;
  condition: string;
  description: string;
  icon: string;
};
type SmartRecommendation = {
  cafe: Cafe;
  distance?: number;
  reason: string;
  priority: number;
  weatherMatch: boolean;
  timeMatch: boolean;
};

type Props = {
  cafes: Cafe[];
  onLocationUpdate: (location: GeolocationPosition | null) => void;
  onRecommendationsUpdate: (recommendations: SmartRecommendation[]) => void;
};

const WEATHER_API_KEY = "demo";

export function LocationService({
  cafes,
  onLocationUpdate,
  onRecommendationsUpdate,
}: Props) {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentTime = () => {
    const now = new Date();
    return {
      hour: now.getHours(),
      dayName: [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ][now.getDay()],
    };
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes("rain")) return <CloudRain className="h-4 w-4" />;
    if (c.includes("snow")) return <Snow className="h-4 w-4" />;
    if (c.includes("cloud")) return <Cloud className="h-4 w-4" />;
    return <Sun className="h-4 w-4" />;
  };

  const isCurrentlyOpen = (cafe: Cafe) => {
    const { hour, dayName } = getCurrentTime();
    const todayHours = cafe.hours[dayName];
    if (!todayHours || todayHours === "Closed") return false;
    try {
      const [openTime, closeTime] = todayHours.split(" - ").map((time) => {
        const [hourStr, period] = time.trim().split(" ");
        let h = Number(hourStr.split(":")[0]);
        if (period === "PM" && h !== 12) h += 12;
        if (period === "AM" && h === 12) h = 0;
        return h;
      });
      return hour >= openTime && hour <= closeTime;
    } catch {
      return true;
    }
  };

  const generateSmartRecommendations = (
    userLocation: GeolocationPosition,
    weatherData: WeatherData | null
  ): SmartRecommendation[] => {
    const { hour } = getCurrentTime();
    const userLat = userLocation.coords.latitude;
    const userLng = userLocation.coords.longitude;
    return cafes
      .map((cafe) => {
        const distance = calculateDistance(
          userLat,
          userLng,
          cafe.coordinates.lat,
          cafe.coordinates.lng
        );
        let reason = "",
          priority = 0,
          weatherMatch = false,
          timeMatch = false;
        if (distance < 2) {
          priority += 30;
          reason = "Very close to you";
        } else if (distance < 5) {
          priority += 20;
          reason = "Nearby location";
        } else if (distance < 10) {
          priority += 10;
          reason = "Within reasonable distance";
        }
        if (hour >= 6 && hour < 10 && cafe.amenities.includes("coffee-bar")) {
          priority += 15;
          timeMatch = true;
          reason += " • Perfect for morning coffee";
        }
        if (hour >= 10 && hour < 14 && cafe.amenities.includes("food-menu")) {
          priority += 10;
          timeMatch = true;
          reason += " • Good for lunch meetings";
        }
        if (hour >= 14 && hour < 18 && cafe.amenities.includes("quiet-zone")) {
          priority += 12;
          timeMatch = true;
          reason += " • Quiet afternoon workspace";
        }
        if (
          (hour >= 18 || hour < 6) &&
          (cafe.amenities.includes("events-space") ||
            cafe.amenities.includes("outdoor-seating"))
        ) {
          priority += 8;
          timeMatch = true;
          reason += " • Great evening atmosphere";
        }
        if (weatherData) {
          const temp = weatherData.temperature;
          const cond = weatherData.condition.toLowerCase();
          if (
            cond.includes("rain") &&
            (cafe.amenities.includes("parking") ||
              cafe.amenities.includes("meeting-rooms"))
          ) {
            priority += 15;
            weatherMatch = true;
            reason += " • Covered parking for rainy weather";
          }
          if (temp > 25 && cafe.amenities.includes("outdoor-seating")) {
            priority += 10;
            weatherMatch = true;
            reason += " • Great weather for outdoor seating";
          }
          if (temp < 15 && cafe.amenities.includes("coffee-bar")) {
            priority += 8;
            weatherMatch = true;
            reason += " • Warm up with great coffee";
          }
        }
        if (cafe.featured) priority += 10;
        if (cafe.rating >= 4.7) priority += 8;
        else if (cafe.rating >= 4.5) priority += 5;
        if (isCurrentlyOpen(cafe)) {
          priority += 20;
          reason += " • Open now";
        } else {
          priority -= 10;
          reason += " • Currently closed";
        }
        return {
          cafe,
          distance,
          reason: reason.replace(/^ • /, ""),
          priority,
          weatherMatch,
          timeMatch,
        };
      })
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 8);
  };

  const fetchWeather = async (lat: number, lng: number) => {
    // Mock weather data for demo
    const mock: WeatherData = {
      temperature: Math.floor(Math.random() * 15) + 20,
      condition: ["Clear", "Partly Cloudy", "Cloudy", "Light Rain"][
        Math.floor(Math.random() * 4)
      ],
      description: "Pleasant weather for café visits",
      icon: "clear",
    };
    setWeather(mock);
    return mock;
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setIsLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocation(pos);
        onLocationUpdate(pos);
        const weatherData = await fetchWeather(
          pos.coords.latitude,
          pos.coords.longitude
        );
        onRecommendationsUpdate(generateSmartRecommendations(pos, weatherData));
        setIsLoading(false);
      },
      (err) => {
        setError(`Location access denied: ${err.message}`);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const getTimeBasedGreeting = () => {
    const { hour } = getCurrentTime();
    if (hour < 10) return "Good morning! ☀️";
    if (hour < 14) return "Good afternoon! 🌤️";
    if (hour < 18) return "Good afternoon! ☀️";
    return "Good evening! 🌙";
  };

  return (
    <div className="space-y-4">
      {!location ? (
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Navigation className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">
                  {getTimeBasedGreeting()}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Let us find the perfect café for you based on your location,
                  current weather, and time of day.
                </p>
                <MotionButton
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
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
                      <span className="font-medium">
                        {weather.temperature}°C
                      </span>
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
