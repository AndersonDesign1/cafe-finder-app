import React, { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "../components/ui/button";
import { MotionButton } from "../components/ui/motion";
import { cn } from "../lib/utils";

type Props = {
  cafeId: string;
  className?: string;
};

export function BookmarkButton({ cafeId, className }: Props) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const bookmarks = JSON.parse(
      localStorage.getItem("cafe-bookmarks") || "[]"
    );
    setBookmarked(bookmarks.includes(cafeId));
  }, [cafeId]);

  const toggle = () => {
    const bookmarks: string[] = JSON.parse(
      localStorage.getItem("cafe-bookmarks") || "[]"
    );
    const updated = bookmarked
      ? bookmarks.filter((id) => id !== cafeId)
      : [...bookmarks, cafeId];
    localStorage.setItem("cafe-bookmarks", JSON.stringify(updated));
    setBookmarked(!bookmarked);
  };

  return (
    <MotionButton
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Button
        variant={bookmarked ? "default" : "secondary"}
        size="sm"
        onClick={toggle}
        className={cn(
          "transition-all cafe-button shadow-menu dark:shadow-menu-dark backdrop-blur-sm",
          bookmarked && "bg-primary text-primary-foreground",
          className
        )}
        aria-pressed={bookmarked}
      >
        <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current")} />
        <span className="sr-only">
          {bookmarked ? "Remove bookmark" : "Add bookmark"}
        </span>
      </Button>
    </MotionButton>
  );
}
