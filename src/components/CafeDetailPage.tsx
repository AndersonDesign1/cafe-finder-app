import React from "react";
import {
  Star,
  MapPin,
  Clock,
  Wifi,
  Zap,
  Volume2,
  Users,
  Car,
  Coffee,
  Utensils,
  BookOpen,
  Calendar,
  Eye,
  TreePine,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { BookmarkButton } from "../components/BookmarkButton";
import { RealTimeStatus } from "../components/RealTimeStatus";
import { BookingSystem } from "../components/BookingSystem";
import { MotionDiv } from "../components/ui/motion";
import type { Cafe } from "../types/cafe";

const amenityIcons: Record<string, { icon: React.ReactNode; label: string }> = {
  "high-speed-wifi": { icon: <Wifi className="h-4 w-4" />, label: "Fast WiFi" },
  "power-outlets": {
    icon: <Zap className="h-4 w-4" />,
    label: "Power Outlets",
  },
  "quiet-zone": { icon: <Volume2 className="h-4 w-4" />, label: "Quiet Zone" },
  "meeting-rooms": {
    icon: <Users className="h-4 w-4" />,
    label: "Meeting Rooms",
  },
  "coffee-bar": { icon: <Coffee className="h-4 w-4" />, label: "Coffee Bar" },
  "food-menu": { icon: <Utensils className="h-4 w-4" />, label: "Food Menu" },
  "outdoor-seating": {
    icon: <TreePine className="h-4 w-4" />,
    label: "Outdoor Seating",
  },
  parking: { icon: <Car className="h-4 w-4" />, label: "Parking Available" },
  "book-exchange": {
    icon: <BookOpen className="h-4 w-4" />,
    label: "Book Exchange",
  },
  "events-space": {
    icon: <Calendar className="h-4 w-4" />,
    label: "Events Space",
  },
  "city-view": { icon: <Eye className="h-4 w-4" />, label: "City View" },
  "tea-selection": {
    icon: <Coffee className="h-4 w-4" />,
    label: "Tea Selection",
  },
  "local-art": { icon: <BookOpen className="h-4 w-4" />, label: "Local Art" },
};

const dayOrder = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function CafeDetailPage({ cafe }: { cafe: Cafe }) {
  const currentDay =
    dayOrder[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  return (
    <div className="container mx-auto px-4 py-8">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
      >
        <div className="space-y-4">
          <div className="aspect-video rounded-lg overflow-hidden">
            <img
              src={cafe.images[0]}
              alt={cafe.name}
              className="w-full h-full object-cover"
            />
          </div>
          {cafe.images.length > 1 && (
            <div className="grid grid-cols-2 gap-4">
              {cafe.images.slice(1).map((img, i) => (
                <div
                  key={i}
                  className="aspect-video rounded-lg overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`${cafe.name} view ${i + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-serif font-bold">{cafe.name}</h1>
              <BookmarkButton cafeId={cafe.id} />
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{cafe.rating}</span>
                <span className="text-muted-foreground">
                  ({cafe.reviews} reviews)
                </span>
              </div>
              {cafe.featured && (
                <Badge className="bg-primary text-primary-foreground">
                  Featured
                </Badge>
              )}
            </div>
            <div className="flex items-start text-muted-foreground mb-4">
              <MapPin className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
              <span>{cafe.address}</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {cafe.description}
            </p>
          </div>
          <div className="flex gap-3">
            <Button size="lg" className="flex-1 cafe-button">
              Get Directions
            </Button>
            <Button variant="outline" size="lg">
              Share
            </Button>
          </div>
        </div>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="status">Live Status</TabsTrigger>
            <TabsTrigger value="booking">Book Now</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {cafe.amenities.map((amenity) => {
                      const info = amenityIcons[amenity];
                      return (
                        <div
                          key={amenity}
                          className="flex items-center space-x-3"
                        >
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            {info?.icon || <Coffee className="h-4 w-4" />}
                          </div>
                          <span className="text-sm">
                            {info?.label || amenity.replace("-", " ")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Hours</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dayOrder.map((day) => (
                      <div
                        key={day}
                        className={`flex justify-between text-sm ${
                          day === currentDay
                            ? "font-medium text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        <span className="capitalize">{day}</span>
                        <span>{cafe.hours[day] || "Closed"}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Location</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Address
                      </p>
                      <p className="text-sm">{cafe.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Coordinates
                      </p>
                      <p className="text-sm font-mono">
                        {cafe.coordinates.lat}, {cafe.coordinates.lng}
                      </p>
                    </div>
                    <Button variant="outline" className="w-full cafe-button">
                      View on Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RealTimeStatus cafe={cafe} />
              <Card>
                <CardHeader>
                  <CardTitle>Status Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        color: "green",
                        time: "2 minutes ago",
                        msg: "WiFi speed test completed: 95 Mbps",
                      },
                      {
                        color: "blue",
                        time: "15 minutes ago",
                        msg: "Occupancy level decreased to moderate",
                      },
                      {
                        color: "yellow",
                        time: "1 hour ago",
                        msg: "New power outlets installed near window seats",
                      },
                    ].map((u, i) => (
                      <div
                        key={i}
                        className={`p-3 bg-${u.color}-50 dark:bg-${u.color}-950/20 rounded-lg border border-${u.color}-200 dark:border-${u.color}-800`}
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <div
                            className={`w-2 h-2 bg-${u.color}-500 rounded-full`}
                          />
                          <span className="font-medium">{u.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {u.msg}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="booking" className="space-y-6">
            <BookingSystem cafe={cafe} />
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>About This Café</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {cafe.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium">Perfect for:</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Remote Work",
                        "Meetings",
                        "Study Sessions",
                        "Casual Dining",
                      ].map((t) => (
                        <Badge key={t} variant="secondary">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Reviews & Ratings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold">{cafe.rating}</div>
                      <div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= Math.floor(cafe.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Based on {cafe.reviews} reviews
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: "WiFi Quality", rating: 4.8 },
                        { label: "Atmosphere", rating: 4.6 },
                        { label: "Coffee Quality", rating: 4.7 },
                        { label: "Work Environment", rating: 4.5 },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm">{item.label}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${(item.rating / 5) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-8">
                              {item.rating}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </MotionDiv>
    </div>
  );
}
