import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { Star, MapPin, Clock, ExternalLink, Navigation } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useTheme } from "../components/ThemeProvider";
import type { Cafe } from "../types/cafe";

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const createCustomIcon = (color: string, featured = false, isDark = false) =>
  L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: ${featured ? 35 : 25}px;
        height: ${featured ? 35 : 25}px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid ${isDark ? "#374151" : "#fff"};
        box-shadow: 0 2px 8px ${
          isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.3)"
        };
        transform: rotate(-45deg);
        display: flex; align-items: center; justify-content: center;">
        <div style="color: white; font-size: ${
          featured ? "16px" : "12px"
        }; transform: rotate(45deg); font-weight: bold; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">☕</div>
      </div>
    `,
    className: "custom-marker",
    iconSize: [featured ? 35 : 25, featured ? 35 : 25],
    iconAnchor: [(featured ? 35 : 25) / 2, featured ? 35 : 25],
    popupAnchor: [0, -(featured ? 35 : 25)],
  });

function MapControls({
  cafes,
  isDark,
  onThemeToggle,
}: {
  cafes: Cafe[];
  isDark: boolean;
  onThemeToggle: () => void;
}) {
  const map = useMap();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const themeControl = new L.Control({ position: "topleft" });
    themeControl.onAdd = () => {
      const div = L.DomUtil.create(
        "div",
        "leaflet-bar leaflet-control leaflet-control-custom"
      );
      div.innerHTML = `<a href="#" title="Toggle Theme" role="button" aria-label="Toggle Theme" style="background:${
        isDark ? "#374151" : "#fff"
      };color:${isDark ? "#fff" : "#000"};border:1px solid ${
        isDark ? "#6b7280" : "#d1d5db"
      };"><span style="font-size:16px;line-height:26px;display:block;">${
        isDark ? "☀️" : "🌙"
      }</span></a>`;
      div.style.width = "30px";
      div.style.height = "30px";
      div.onclick = (e) => {
        e.preventDefault();
        onThemeToggle();
      };
      return div;
    };
    themeControl.addTo(map);

    const fullscreenControl = new L.Control({ position: "topleft" });
    fullscreenControl.onAdd = () => {
      const div = L.DomUtil.create(
        "div",
        "leaflet-bar leaflet-control leaflet-control-custom"
      );
      div.innerHTML = `<a href="#" title="Toggle Fullscreen" role="button" aria-label="Toggle Fullscreen" style="background:${
        isDark ? "#374151" : "#fff"
      };color:${isDark ? "#fff" : "#000"};border:1px solid ${
        isDark ? "#6b7280" : "#d1d5db"
      };"><span style="font-size:18px;line-height:26px;display:block;">⛶</span></a>`;
      div.style.width = "30px";
      div.style.height = "30px";
      div.onclick = (e) => {
        e.preventDefault();
        toggleFullscreen();
      };
      return div;
    };
    fullscreenControl.addTo(map);

    const scaleControl = L.control.scale({
      position: "bottomleft",
      imperial: false,
      maxWidth: 150,
    });
    scaleControl.addTo(map);

    if (cafes.length > 0) {
      const bounds = L.latLngBounds(
        cafes.map((c) => [c.coordinates.lat, c.coordinates.lng])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }

    function toggleFullscreen() {
      const mapContainer = map.getContainer().parentElement;
      if (!mapContainer) return;
      if (!isFullscreen) {
        mapContainer.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      setIsFullscreen((f) => !f);
    }

    return () => {
      themeControl.remove();
      fullscreenControl.remove();
      scaleControl.remove();
    };
  }, [map, cafes, isDark, onThemeToggle]);

  return null;
}

const getCurrentDayHours = (cafe: Cafe) => {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const today = days[new Date().getDay()];
  return cafe.hours[today] || "Closed";
};

const isCurrentlyOpen = (cafe: Cafe) => {
  const hours = getCurrentDayHours(cafe);
  if (hours === "Closed") return false;
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [openTime, closeTime] = hours.split(" - ").map((time) => {
    const [hourStr, period] = time.trim().split(" ");
    const [hour, minute = 0] = hourStr.split(":").map(Number);
    let adjustedHour = hour;
    if (period === "PM" && hour !== 12) adjustedHour += 12;
    if (period === "AM" && hour === 12) adjustedHour = 0;
    return adjustedHour * 60 + minute;
  });
  return currentTime >= openTime && currentTime <= closeTime;
};

export function InteractiveMap({
  cafes,
  selectedCafe,
  onCafeSelect,
}: {
  cafes: Cafe[];
  selectedCafe?: string | null;
  onCafeSelect?: (cafeId: string) => void;
}) {
  const mapRef = useRef<L.Map>(null);
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode =
        theme === "dark" ||
        (theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      setIsDark(isDarkMode);
    };
    checkTheme();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", checkTheme);
    return () => mediaQuery.removeEventListener("change", checkTheme);
  }, [theme]);

  const handleGetDirections = (cafe: Cafe) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${cafe.coordinates.lat},${cafe.coordinates.lng}`,
      "_blank"
    );
  };

  const handleThemeToggle = () => setTheme(isDark ? "light" : "dark");

  const featuredIcon = createCustomIcon("#3b82f6", true, isDark);
  const regularIcon = createCustomIcon("#10b981", false, isDark);

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border shadow-lg bg-background">
      <MapContainer
        center={[9.0579, 7.4951]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
        zoomControl
        scrollWheelZoom
        className={isDark ? "dark-map" : "light-map"}
      >
        {!isDark && (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}
        {isDark && (
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        )}
        <MapControls
          cafes={cafes}
          isDark={isDark}
          onThemeToggle={handleThemeToggle}
        />
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          spiderfyOnMaxZoom
          showCoverageOnHover={false}
          zoomToBoundsOnClick
          iconCreateFunction={(cluster: any) => {
            const count = cluster.getChildCount();
            const bgGradient = isDark
              ? "linear-gradient(135deg, #4f46e5, #3730a3)"
              : "linear-gradient(135deg, #3b82f6, #1d4ed8)";
            const borderColor = isDark ? "#6b7280" : "#fff";
            const shadowColor = isDark
              ? "rgba(255,255,255,0.2)"
              : "rgba(0,0,0,0.3)";
            return L.divIcon({
              html: `<div style="background:${bgGradient};color:white;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;border:3px solid ${borderColor};box-shadow:0 2px 8px ${shadowColor};text-shadow:0 1px 2px rgba(0,0,0,0.5);">${count}</div>`,
              className: "custom-cluster-icon",
              iconSize: [40, 40],
            });
          }}
        >
          {cafes.map((cafe) => (
            <Marker
              key={cafe.id}
              position={[cafe.coordinates.lat, cafe.coordinates.lng]}
              icon={cafe.featured ? featuredIcon : regularIcon}
              eventHandlers={{ click: () => onCafeSelect?.(cafe.id) }}
            >
              <Popup
                maxWidth={350}
                className={`custom-popup ${
                  isDark ? "dark-popup" : "light-popup"
                }`}
              >
                <div
                  className={`p-4 min-w-[300px] ${
                    isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3
                        className={`font-bold text-lg mb-1 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {cafe.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-sm">
                            {cafe.rating}
                          </span>
                          <span
                            className={`text-sm ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            ({cafe.reviews} reviews)
                          </span>
                        </div>
                        {cafe.featured && (
                          <Badge variant="secondary" className="text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`flex items-start text-sm mb-3 ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <MapPin className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="line-clamp-2">{cafe.address}</span>
                  </div>
                  <div className="flex items-center text-sm mb-3">
                    <Clock className="h-4 w-4 mr-2" />
                    <span
                      className={`font-medium ${
                        isCurrentlyOpen(cafe)
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {isCurrentlyOpen(cafe) ? "Open" : "Closed"} •{" "}
                      {getCurrentDayHours(cafe)}
                    </span>
                  </div>
                  <p
                    className={`text-sm mb-4 line-clamp-3 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {cafe.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {cafe.amenities.slice(0, 3).map((amenity) => (
                      <Badge
                        key={amenity}
                        variant="outline"
                        className="text-xs"
                      >
                        {amenity.replace("-", " ")}
                      </Badge>
                    ))}
                    {cafe.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{cafe.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        window.open(`/cafe/${cafe.slug}`, "_blank")
                      }
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGetDirections(cafe)}
                    >
                      <Navigation className="h-3 w-3 mr-1" />
                      Directions
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
