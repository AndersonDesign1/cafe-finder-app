import React from "react";
import { Coffee, Bookmark, MapPin, Map } from "lucide-react";
import { Button } from "../components/ui/button";
import { ThemeToggle } from "../components/ThemeToggle";
import { MotionDiv, MotionButton } from "../components/ui/motion";

export function Header() {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-menu dark:shadow-menu-dark">
        <div className="container flex h-16 items-center justify-between">
          <MotionDiv
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex items-center space-x-2"
          >
            <Coffee className="h-6 w-6 text-primary" />
            <a
              href="/"
              className="text-xl font-serif font-bold tracking-tight hover:text-primary transition-colors"
            >
              CaféWork
            </a>
          </MotionDiv>

          <nav className="hidden md:flex items-center space-x-6">
            <MotionDiv
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <a
                href="/"
                className="text-foreground/70 hover:text-foreground transition-colors font-medium"
              >
                Home
              </a>
            </MotionDiv>
            <MotionDiv
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <a
                href="/cafes"
                className="text-foreground/70 hover:text-foreground transition-colors flex items-center space-x-1 font-medium"
              >
                <MapPin className="h-4 w-4" />
                <span>Find Cafés</span>
              </a>
            </MotionDiv>
            <MotionDiv
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <a
                href="/map"
                className="text-foreground/70 hover:text-foreground transition-colors flex items-center space-x-1 font-medium"
              >
                <Map className="h-4 w-4" />
                <span>Map View</span>
              </a>
            </MotionDiv>
            <MotionDiv
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <a
                href="/bookmarks"
                className="text-foreground/70 hover:text-foreground transition-colors flex items-center space-x-1 font-medium"
              >
                <Bookmark className="h-4 w-4" />
                <span>Bookmarks</span>
              </a>
            </MotionDiv>
          </nav>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <div className="md:hidden">
              <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Button variant="ghost" size="sm" className="cafe-button">
                  <Coffee className="h-4 w-4" />
                </Button>
              </MotionButton>
            </div>
          </div>
        </div>
      </header>
    </MotionDiv>
  );
}
