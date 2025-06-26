export interface Cafe {
  id: string;
  name: string;
  slug: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  amenities: string[];
  hours: Record<string, string>;
  description: string;
  images: string[];
  rating: number;
  reviews: number;
  featured?: boolean;
}

export interface FilterOptions {
  search: string;
  amenities: string[];
  minRating: number;
}