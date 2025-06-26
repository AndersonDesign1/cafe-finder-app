# CaféWork - Smart Remote Work Café Finder

A modern, AI-powered (No AI) platform for discovering and booking the perfect work-friendly cafés with smart recommendations, real-time status monitoring, and seamless booking experiences.

![CaféWork Hero](https://images.pexels.com/photos/2159065/pexels-photo-2159065.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop)

## ✨ Features

### 🎯 **Smart Recommendations**

- **AI-Powered Matching**: Personalized café suggestions based on location, weather, time of day, and user preferences
- **Context-Aware**: Recommendations adapt to current conditions (rainy weather = covered parking priority)
- **Real-Time Scoring**: Dynamic priority system considering distance, ratings, amenities, and availability

### 📍 **Location Intelligence**

- **Geolocation Integration**: Automatic location detection with distance calculations
- **Weather Integration**: Weather-aware recommendations for optimal workspace selection
- **Interactive Maps**: Clustered markers with detailed café information and directions

### 📊 **Real-Time Status Dashboard**

- **Live Occupancy**: Real-time seat availability and crowd levels
- **WiFi Monitoring**: Current internet speed and quality metrics
- **Noise Level Tracking**: Ambient sound monitoring for productivity assessment
- **Power Outlet Availability**: Live count of available charging stations

### 📅 **Advanced Booking System**

- **Multi-Step Booking**: Intuitive date/time selection with availability checking
- **Flexible Options**: Various table types, durations, and group sizes
- **Smart Pricing**: Dynamic pricing based on time slots and table types
- **Instant Confirmation**: Real-time booking confirmation with calendar integration

### 🗺️ **Interactive Map Experience**

- **Clustered Markers**: Efficient visualization of café locations
- **Theme-Aware Design**: Automatic dark/light mode map styling
- **Detailed Popups**: Rich café information with ratings, amenities, and quick actions
- **Responsive Controls**: Touch-friendly interface with fullscreen support

### 🎨 **Premium Design**

- **Café-Inspired Aesthetics**: Warm color palette with coffee-themed design elements
- **Smooth Animations**: Framer Motion powered micro-interactions
- **Responsive Layout**: Mobile-first design with perfect desktop scaling
- **Dark Mode Support**: Seamless theme switching with system preference detection

## 🛠️ Tech Stack

### **Frontend Framework**

- **[Astro](https://astro.build/)**
- **[React](https://react.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)**

### **Styling & UI**

- **[Tailwind CSS](https://tailwindcss.com/)**
- **[shadcn/ui](https://ui.shadcn.com/)**
- **[Radix UI](https://www.radix-ui.com/)**
- **[Lucide React](https://lucide.dev/)**

### **Maps & Location**

- **[Leaflet](https://leafletjs.com/)**
- **[React Leaflet](https://react-leaflet.js.org/)**
- **[Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)**

### **Animations & Interactions**

- **[Framer Motion](https://www.framer.com/motion/)**
- **[Tailwind CSS Animate](https://github.com/jamiebuilds/tailwindcss-animate)**

### **Development Tools**

- **[Vite](https://vitejs.dev/)**
- **[Class Variance Authority](https://cva.style/)**
- **[clsx](https://github.com/lukeed/clsx)**
- **[Tailwind Merge](https://github.com/dcastil/tailwind-merge)**

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **pnpm** (recommended), or npm

### Installation

**Clone the repository**

```bash
 git clone https://github.com/AndersonDesign1/cafe-finder-app.git
 cd cafe-finder-app
```

### Installation

```bash
git clone https://github.com/AndersonDesign1/cafe-finder-app.git
cd cafe-finder-app
pnpm install
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

### Build for Production

```bash
pnpm build
pnpm preview
```

## 📁 Project Structure

```
cafe-finder-app/
├── src/
│   ├── components/
│   │   ├── BookingSystem.tsx
│   │   ├── CafeCard.tsx
│   │   ├── CafeDetailPage.tsx
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── InteractiveMap.tsx
│   │   ├── LocationService.tsx
│   │   ├── RealTimeStatus.tsx
│   │   ├── SearchFilter.tsx
│   │   ├── SmartRecommendations.tsx
│   │   ├── BookmarkButton.tsx
│   │   ├── BookmarksPage.tsx
│   │   ├── MapPage.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── ui/
│   ├── data/
│   │   └── cafes.json
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── cafes.astro
│   │   ├── map.astro
│   │   ├── bookmarks.astro
│   │   └── cafe/
│   │       └── [slug].astro
│   ├── styles/
│   │   └── globals.css
│   └── types/
│       └── cafe.ts
├── public/
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

## 🎨 Customization

### **Adding New Cafés**

Edit `src/data/cafes.json` to add new café entries:

```json
{
  "id": "unique-cafe-id",
  "name": "Café Name",
  "slug": "cafe-name",
  "address": "Full Address",
  "coordinates": {
    "lat": 6.4281,
    "lng": 3.4219
  },
  "amenities": ["high-speed-wifi", "power-outlets", "quiet-zone"],
  "hours": {
    "monday": "8:00 AM - 10:00 PM",
    "tuesday": "8:00 AM - 10:00 PM"
  },
  "description": "Café description...",
  "images": ["image-url-1", "image-url-2"],
  "rating": 4.8,
  "reviews": 156,
  "featured": true
}
```

## 🌐 Deployment

**Recommended:** [Vercel](https://vercel.com/)

1. **Import project** from GitHub
2. **Framework preset**: Astro
3. **Deploy** with zero configuration

---

## 🤝 Contributing

- **Issues:** [github.com/AndersonDesign1/cafe-finder-app/issues](https://github.com/AndersonDesign1/cafe-finder-app/issues)
- **Pull Requests:** Fork and PR to [AndersonDesign1/cafe-finder-app](https://github.com/AndersonDesign1/cafe-finder-app)

---

## 📄 License

MIT

---

<div align="center">

Made with ☕ and ❤️ by Andy

</div>
