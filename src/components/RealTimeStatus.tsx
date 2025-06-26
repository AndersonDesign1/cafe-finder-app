import React, { useState, useEffect } from 'react';
import { Users, Wifi, Clock, Zap, Volume2, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { MotionDiv } from '../components/ui/motion';
import type { Cafe } from '../types/cafe';

interface RealTimeStatusProps {
  cafe: Cafe;
}

interface StatusData {
  occupancy: {
    level: 'low' | 'medium' | 'high';
    percentage: number;
    availableSeats: number;
    totalSeats: number;
  };
  wifi: {
    speed: number;
    quality: 'excellent' | 'good' | 'fair' | 'poor';
    lastTested: string;
  };
  noise: {
    level: 'quiet' | 'moderate' | 'busy';
    decibels: number;
  };
  waitTime: {
    estimated: number;
    hasQueue: boolean;
  };
  powerOutlets: {
    available: number;
    total: number;
  };
  lastUpdated: string;
}

// Mock real-time data generator
const generateMockStatus = (): StatusData => {
  const occupancyPercentage = Math.floor(Math.random() * 100);
  const totalSeats = 40 + Math.floor(Math.random() * 60);
  const availableSeats = Math.floor((100 - occupancyPercentage) / 100 * totalSeats);
  
  return {
    occupancy: {
      level: occupancyPercentage < 30 ? 'low' : occupancyPercentage < 70 ? 'medium' : 'high',
      percentage: occupancyPercentage,
      availableSeats,
      totalSeats
    },
    wifi: {
      speed: 50 + Math.floor(Math.random() * 150),
      quality: Math.random() > 0.8 ? 'excellent' : Math.random() > 0.6 ? 'good' : Math.random() > 0.3 ? 'fair' : 'poor',
      lastTested: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString()
    },
    noise: {
      level: Math.random() > 0.6 ? 'quiet' : Math.random() > 0.3 ? 'moderate' : 'busy',
      decibels: 35 + Math.floor(Math.random() * 30)
    },
    waitTime: {
      estimated: Math.floor(Math.random() * 20),
      hasQueue: Math.random() > 0.7
    },
    powerOutlets: {
      available: Math.floor(Math.random() * 15),
      total: 20
    },
    lastUpdated: new Date().toISOString()
  };
};

export function RealTimeStatus({ cafe }: RealTimeStatusProps) {
  const [status, setStatus] = useState<StatusData>(generateMockStatus());
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      setStatus(generateMockStatus());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getOccupancyColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getOccupancyIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <AlertCircle className="h-4 w-4" />;
      case 'high': return <XCircle className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getWifiColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getNoiseColor = (level: string) => {
    switch (level) {
      case 'quiet': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'busy': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            Live Status
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Updated {formatTimeAgo(status.lastUpdated)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Occupancy Status */}
        <MotionDiv
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Occupancy</span>
              </div>
              <Badge className={`${getOccupancyColor(status.occupancy.level)} border`}>
                {getOccupancyIcon(status.occupancy.level)}
                <span className="ml-1 capitalize">{status.occupancy.level}</span>
              </Badge>
            </div>
            <div className="space-y-2">
              <Progress value={status.occupancy.percentage} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{status.occupancy.availableSeats} seats available</span>
                <span>{status.occupancy.percentage}% full</span>
              </div>
            </div>
          </div>
        </MotionDiv>

        {/* WiFi Status */}
        <MotionDiv
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">WiFi Speed</span>
              </div>
              <Badge variant="outline" className={getWifiColor(status.wifi.quality)}>
                {status.wifi.speed} Mbps
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Quality: <span className={`font-medium ${getWifiColor(status.wifi.quality)}`}>
                {status.wifi.quality}
              </span>
              <span className="ml-2">• Tested {formatTimeAgo(status.wifi.lastTested)}</span>
            </div>
          </div>
        </MotionDiv>

        {/* Noise Level */}
        <MotionDiv
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Noise Level</span>
              </div>
              <Badge variant="outline" className={getNoiseColor(status.noise.level)}>
                {status.noise.decibels} dB
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Environment: <span className={`font-medium capitalize ${getNoiseColor(status.noise.level)}`}>
                {status.noise.level}
              </span>
            </div>
          </div>
        </MotionDiv>

        {/* Wait Time */}
        <MotionDiv
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Wait Time</span>
              </div>
              <Badge variant="outline" className={status.waitTime.hasQueue ? 'text-yellow-600' : 'text-green-600'}>
                {status.waitTime.estimated === 0 ? 'No wait' : `${status.waitTime.estimated} min`}
              </Badge>
            </div>
            {status.waitTime.hasQueue && (
              <div className="text-sm text-muted-foreground">
                Queue detected - consider booking ahead
              </div>
            )}
          </div>
        </MotionDiv>

        {/* Power Outlets */}
        <MotionDiv
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Power Outlets</span>
              </div>
              <Badge variant="outline" className={status.powerOutlets.available > 5 ? 'text-green-600' : 'text-yellow-600'}>
                {status.powerOutlets.available} available
              </Badge>
            </div>
            <div className="space-y-2">
              <Progress 
                value={(status.powerOutlets.available / status.powerOutlets.total) * 100} 
                className="h-2" 
              />
              <div className="text-sm text-muted-foreground">
                {status.powerOutlets.available} of {status.powerOutlets.total} outlets free
              </div>
            </div>
          </div>
        </MotionDiv>
      </CardContent>
    </Card>
  );
}