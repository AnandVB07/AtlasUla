import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components/UI';
import { WeatherCard } from '../components/WeatherCard';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  AlertCircle,
  Clock,
  Compass
} from 'lucide-react';
import { MOCK_WEATHER } from '../utils/mockData';
import { WeatherReport, Trip } from '../types';
import { tripService } from '../services/api';
import { toast } from 'react-hot-toast';

export const Weather: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [weather, setWeather] = useState<WeatherReport>(MOCK_WEATHER.default);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWeatherSource, setActiveWeatherSource] = useState<'trip' | 'search'>('trip');

  // Load Trips from API
  const loadTrips = async () => {
    try {
      const loaded = await tripService.getTrips();
      setTrips(loaded);
      if (loaded.length > 0) {
        setSelectedTrip(loaded[0]);
        resolveWeather(loaded[0].destination);
      }
    } catch (e) {
      console.error(e);
      resolveWeather('default');
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const resolveWeather = (destination: string) => {
    const destLower = destination.toLowerCase();
    if (destLower.includes('paris')) {
      setWeather(MOCK_WEATHER.paris);
    } else if (destLower.includes('tokyo')) {
      setWeather(MOCK_WEATHER.tokyo);
    } else {
      setWeather({
        ...MOCK_WEATHER.default,
        city: destination.split(',')[0] || 'Destination'
      });
    }
  };

  const handleTripChange = (tripId: string) => {
    const match = trips.find(t => t.id === tripId) || null;
    setSelectedTrip(match);
    setActiveWeatherSource('trip');
    if (match) {
      resolveWeather(match.destination);
    } else {
      resolveWeather('default');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Simulate weather fetch
    const qLower = searchQuery.toLowerCase();
    let result: WeatherReport;

    if (qLower.includes('paris')) {
      result = MOCK_WEATHER.paris;
    } else if (qLower.includes('tokyo')) {
      result = MOCK_WEATHER.tokyo;
    } else {
      // Dynamic Mock generator
      result = {
        city: searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1),
        temp: Math.floor(Math.random() * 15) + 12, // 12-27 C
        humidity: Math.floor(Math.random() * 30) + 50,
        windSpeed: Math.floor(Math.random() * 15) + 5,
        rainProbability: Math.floor(Math.random() * 60) + 10,
        condition: Math.random() > 0.5 ? 'Partly Cloudy' : 'Sunny',
        description: 'Vibrant sky, warm daylight breeze.',
        icon: 'Sun',
        forecast: [
          { date: 'Today', temp: 22, condition: 'Sunny', icon: 'Sun' },
          { date: 'Tomorrow', temp: 21, condition: 'Partly Cloudy', icon: 'CloudSun' },
          { date: 'Day 3', temp: 23, condition: 'Clear', icon: 'Sun' },
          { date: 'Day 4', temp: 19, condition: 'Showers', icon: 'CloudRain' },
          { date: 'Day 5', temp: 20, condition: 'Overcast', icon: 'Cloud' }
        ]
      };
    }

    setWeather(result);
    setActiveWeatherSource('search');
    toast.success(`Weather details loaded for ${result.city}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-white/5 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-sora">Weather Center</h1>
          <p className="text-xs text-textSecondary mt-1">Get real-time forecasts, UV indexes, and weather-aware itinerary recommendations.</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-textSecondary" />
            <input
              type="text"
              placeholder="Search any city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 sm:w-60 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-primary font-medium"
            />
          </div>
          <Button type="submit" variant="primary" size="sm" className="h-9 cursor-pointer">Search</Button>
        </form>
      </div>

      {/* Selector Dropdown (Sync with Trip) */}
      {trips.length > 0 && (
        <Card variant="glass" className="p-4 border-white/5 flex flex-wrap gap-4 items-center justify-between bg-card/15">
          <div className="flex items-center gap-3">
            <span className="text-xs text-textSecondary font-semibold">Active Trip Weather:</span>
            <select
              value={activeWeatherSource === 'trip' ? selectedTrip?.id || '' : ''}
              onChange={(e) => handleTripChange(e.target.value)}
              className="glass-input rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none cursor-pointer bg-card"
            >
              {activeWeatherSource === 'search' && <option value="">Custom Search View</option>}
              {trips.map(t => (
                <option key={t.id} value={t.id}>📍 {t.destination}</option>
              ))}
            </select>
          </div>
          <div className="text-[10px] text-textSecondary font-medium">
            Currently tracking: <span className="text-accent font-bold">{weather.city}</span>
          </div>
        </Card>
      )}

      {/* Main Grid: Weather Display and Weather-Aware Planning advice */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Weather Card widget */}
        <div className="lg:col-span-8">
          <WeatherCard weather={weather} />
        </div>

        {/* Weather-Aware recommendations */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-lg font-bold text-white font-sora">Weather Itinerary Tips</h2>
          
          <Card variant="solid" className="p-5 bg-card/65 border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-accent">
              <Sparkles className="w-5 h-5 animate-pulse-glow" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-sora">AI Climate Adjustments</h3>
            </div>

            <div className="space-y-3.5 pt-1">
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs space-y-1">
                <h4 className="font-bold text-white flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-accent" /> Hourly Adjustments</h4>
                <p className="text-[10px] text-textSecondary leading-relaxed">
                  Best window for outdoor sightseeing is **10:00 AM - 1:00 PM** when heat index is moderate and rain probability drops below 20%.
                </p>
              </div>

              <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs space-y-1">
                <h4 className="font-bold text-white flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-warning" /> Activity Swap Alerts</h4>
                <p className="text-[10px] text-textSecondary leading-relaxed">
                  If forecasts show precipitation &gt; 50% on your packing days, Atlas AI will automatically label your scheduled open-air tours as "weather sensitive".
                </p>
              </div>

              <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs space-y-1">
                <h4 className="font-bold text-white flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 text-success" /> UV Index Warning</h4>
                <p className="text-[10px] text-textSecondary leading-relaxed">
                  UV index peaks at 7 (High). Sunscreen, hydration, and sunglasses are highly recommended between **11 AM and 3 PM**.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Weather;
