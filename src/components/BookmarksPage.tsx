import React, { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { CafeCard } from "../components/CafeCard";
import { MotionDiv, StaggeredContainer } from "../components/ui/motion";
import type { Cafe } from "../types/cafe";
import cafesData from "../data/cafes.json";

export function BookmarksPage() {
  const [cafes, setCafes] = useState<Cafe[]>([]);

  useEffect(() => {
    const bookmarks = JSON.parse(
      localStorage.getItem("cafe-bookmarks") || "[]"
    );
    setCafes(cafesData.filter((cafe) => bookmarks.includes(cafe.id)));
  }, []);

  if (cafes.length === 0) {
    return (
      <MotionDiv
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center py-20"
      >
        <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Bookmark className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-serif font-semibold mb-3">
          No bookmarks yet
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Start exploring cafés and bookmark your favorites to see them here.
        </p>
        <MotionDiv
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <a
            href="/cafes"
            className="inline-flex items-center justify-center rounded-cafe text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 py-3 cafe-button shadow-cafe dark:shadow-cafe-dark"
          >
            Explore Cafés
          </a>
        </MotionDiv>
      </MotionDiv>
    );
  }

  return (
    <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cafes.map((cafe, i) => (
        <MotionDiv
          key={cafe.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
        >
          <CafeCard cafe={cafe} />
        </MotionDiv>
      ))}
    </StaggeredContainer>
  );
}
