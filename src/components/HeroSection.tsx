import React from 'react';
import { Search, MapPin, Wifi, Coffee } from 'lucide-react';
import { Button } from '../components/ui/button';
import { MotionDiv, StaggeredContainer, MotionButton } from '../components/ui/motion';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-background via-background to-muted py-20 px-4 overflow-hidden">
      {/* Background texture overlay */}
      <div className="absolute inset-0 bg-coffee-grain dark:bg-coffee-grain-dark opacity-30" />
      
      <div className="container mx-auto text-center relative z-10">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-6">
            Find Your Perfect
            <MotionDiv
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="text-primary block"
            >
              Remote Work Café
            </MotionDiv>
          </h1>
        </MotionDiv>
        
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-medium">
            Discover work-friendly cafés with fast WiFi, comfortable seating, and the perfect atmosphere for productivity.
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
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Button size="lg" asChild className="cafe-button shadow-cafe dark:shadow-cafe-dark">
              <a href="/cafes" className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Explore Cafés
              </a>
            </Button>
          </MotionButton>
          <MotionButton
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
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
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center space-y-3 p-6 rounded-cafe bg-card/50 backdrop-blur-sm shadow-menu dark:shadow-menu-dark"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Wifi className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-serif font-semibold text-lg">Fast WiFi</h3>
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              High-speed internet perfect for video calls and large file transfers
            </p>
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col items-center space-y-3 p-6 rounded-cafe bg-card/50 backdrop-blur-sm shadow-menu dark:shadow-menu-dark"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-serif font-semibold text-lg">Great Locations</h3>
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              Carefully curated cafés in convenient neighborhoods
            </p>
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col items-center space-y-3 p-6 rounded-cafe bg-card/50 backdrop-blur-sm shadow-menu dark:shadow-menu-dark"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Coffee className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-serif font-semibold text-lg">Work-Friendly</h3>
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              Comfortable seating, power outlets, and laptop-friendly environments
            </p>
          </MotionDiv>
        </StaggeredContainer>
      </div>
    </section>
  );
}