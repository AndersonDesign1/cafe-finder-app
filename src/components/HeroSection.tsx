import React from "react";
import { Search, MapPin, Wifi, Coffee } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  MotionDiv,
  StaggeredContainer,
  MotionButton,
} from "../components/ui/motion";

const features = [
  {
    icon: <Wifi className="h-6 w-6 text-primary" />,
    title: "Fast WiFi",
    desc: "High-speed internet perfect for video calls and large file transfers",
  },
  {
    icon: <MapPin className="h-6 w-6 text-primary" />,
    title: "Great Locations",
    desc: "Carefully curated cafés in convenient neighborhoods",
  },
  {
    icon: <Coffee className="h-6 w-6 text-primary" />,
    title: "Work-Friendly",
    desc: "Comfortable seating, power outlets, and laptop-friendly environments",
  },
];

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-background via-background to-muted py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-coffee-grain dark:bg-coffee-grain-dark opacity-30" />
      <div className="container mx-auto text-center relative z-10">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-6">
            Find Your Perfect
            <span className="text-primary block">Remote Work Café</span>
          </h1>
        </MotionDiv>
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-medium">
            Discover work-friendly cafés with fast WiFi, comfortable seating,
            and the perfect atmosphere for productivity.
          </p>
        </MotionDiv>
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <MotionButton
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              size="lg"
              asChild
              className="cafe-button shadow-cafe dark:shadow-cafe-dark"
            >
              <a href="/cafes" className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Explore Cafés
              </a>
            </Button>
          </MotionButton>
          <MotionButton
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button variant="outline" size="lg" asChild className="cafe-button">
              <a href="/bookmarks" className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                View Bookmarks
              </a>
            </Button>
          </MotionButton>
        </MotionDiv>
        <StaggeredContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((f, i) => (
            <MotionDiv
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: i * 0.1 }}
              className="flex flex-col items-center space-y-3 p-6 rounded-cafe bg-card/50 backdrop-blur-sm shadow-menu dark:shadow-menu-dark"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="font-serif font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                {f.desc}
              </p>
            </MotionDiv>
          ))}
        </StaggeredContainer>
      </div>
    </section>
  );
}
