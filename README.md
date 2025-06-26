# CaféWork - Smart Remote Work Café Finder

A modern, AI-powered platform for discovering and booking the perfect work-friendly cafés. Built with cutting-edge web technologies and featuring intelligent recommendations, real-time status monitoring, and seamless booking experiences.

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
- **[Astro](https://astro.build/)** - Modern static site generator with component islands
- **[React](https://react.dev/)** - Interactive components with hooks and state management
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development experience

### **Styling & UI**
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework with custom café theme
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality, accessible component library
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible UI primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful, customizable icon library

### **Maps & Location**
- **[Leaflet](https://leafletjs.com/)** - Open-source interactive maps
- **[React Leaflet](https://react-leaflet.js.org/)** - React components for Leaflet maps
- **[Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)** - Marker clustering for better performance

### **Animations & Interactions**
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready motion library
- **[Tailwind CSS Animate](https://github.com/jamiebuilds/tailwindcss-animate)** - Animation utilities

### **Development Tools**
- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
- **[Class Variance Authority](https://cva.style/)** - Component variant management
- **[clsx](https://github.com/lukeed/clsx)** - Conditional className utility
- **[Tailwind Merge](https://github.com/dcastil/tailwind-merge)** - Merge Tailwind classes efficiently

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- Modern web browser with geolocation support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/cafework.git
   cd cafework
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   ```
   http://localhost:4321
   ```

### Build for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## 📁 Project Structure

```
cafework/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── BookingSystem.tsx
│   │   ├── CafeCard.tsx
│   │   ├── InteractiveMap.tsx
│   │   ├── LocationService.tsx
│   │   ├── RealTimeStatus.tsx
│   │   └── SmartRecommendations.tsx
│   ├── data/
│   │   └── cafes.json       # Café database
│   ├── layouts/
│   │   └── Layout.astro     # Base layout
│   ├── pages/               # Astro pages (routes)
│   │   ├── index.astro      # Homepage
│   │   ├── cafes.astro      # Café listing
│   │   ├── map.astro        # Interactive map
│   │   ├── bookmarks.astro  # Saved cafés
│   │   └── cafe/
│   │       └── [slug].astro # Individual café pages
│   ├── styles/
│   │   └── globals.css      # Global styles and theme
│   └── types/
│       └── cafe.ts          # TypeScript definitions
├── public/                  # Static assets
├── astro.config.mjs        # Astro configuration
├── tailwind.config.mjs     # Tailwind configuration
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

### **Theme Customization**

Modify the color scheme in `tailwind.config.mjs`:

```javascript
colors: {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  // Add custom colors
}
```

Update CSS variables in `src/styles/globals.css`:

```css
:root {
  --primary: 25 35% 25%;    /* Coffee brown */
  --secondary: 35 25% 85%;  /* Latte color */
  /* Customize theme colors */
}
```

## 🌐 Deployment

### **Netlify** (Recommended)

1. **Connect your repository** to Netlify
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Deploy** automatically on git push

### **Vercel**

1. **Import project** from GitHub
2. **Framework preset**: Astro
3. **Deploy** with zero configuration

### **Manual Deployment**

```bash
# Build the project
npm run build

# Upload the 'dist' folder to your hosting provider
```

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

**Required Features:**
- Geolocation API
- CSS Grid & Flexbox
- ES2020+ JavaScript features

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Workflow**

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Code Style**

- **ESLint** for JavaScript/TypeScript linting
- **Prettier** for code formatting
- **Conventional Commits** for commit messages

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Pexels](https://pexels.com/)** for beautiful café photography
- **[OpenStreetMap](https://openstreetmap.org/)** for map data
- **[Radix UI](https://radix-ui.com/)** for accessible components
- **[shadcn/ui](https://ui.shadcn.com/)** for component inspiration

## 📞 Support

- **Documentation**: [docs.cafework.com](https://docs.cafework.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/cafework/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/cafework/discussions)
- **Email**: support@cafework.com

---

<div align="center">

**[Live Demo](https://cafework-demo.netlify.app)** • **[Documentation](https://docs.cafework.com)** • **[Report Bug](https://github.com/your-username/cafework/issues)**

Made with ☕ and ❤️ by the CaféWork team

</div>