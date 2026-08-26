import React from 'react';
import { Card } from './UI';
import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  Droplets, 
  Wind, 
  Umbrella,
  Compass
} from 'lucide-react';
import { WeatherReport } from '../types';

interface WeatherCardProps {
  weather: WeatherReport;
  compact?: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, compact = false }) => {
  const { city, temp, humidity, windSpeed, rainProbability, condition, description, forecast } = weather;

  // Resolve condition icons
  const getWeatherIcon = (cond: string, className = "w-10 h-10") => {
    const normalized = cond.toLowerCase();
    if (normalized.includes('sun') || normalized.includes('clear')) {
      return <Sun className={`${className} text-warning`} />;
    }
    if (normalized.includes('cloud') && normalized.includes('sun')) {
      return <CloudSun className={`${className} text-textSecondary`} />;
    }
    if (normalized.includes('cloud')) {
      return <Cloud className={`${className} text-textSecondary`} />;
    }
    if (normalized.includes('rain') || normalized.includes('drizzle') || normalized.includes('shower')) {
      return <CloudRain className={`${className} text-accent`} />;
    }
    if (normalized.includes('thunder') || normalized.includes('storm')) {
      return <CloudLightning className={`${className} text-primary-light`} />;
    }
    return <CloudSun className={`${className} text-textSecondary`} />;
  };

  // Weather-aware AI trip advice
  const getTravelAdvice = () => {
    const cond = condition.toLowerCase();
    if (cond.includes('rain') || cond.includes('storm')) {
      return "Heavy rain predicted. Perfect day to explore local indoor museums, art galleries, and cafes! Tag your outdoor plans as weather-sensitive.";
    }
    if (temp > 30) {
      return "Very warm climate. Carry extra hydration, schedule outdoor treks in early mornings, and stay in shade during noon hours.";
    }
    if (temp < 10) {
      return "Cold winds. Dress in thick layers, carry thermals, and plan indoor dining stops to warm up during exploration.";
    }
    return "Beautiful moderate climate! Ideal for open-air walks, biking tours, hikes, and rooftop sunsets. Enjoy your exploration.";
  };

  if (compact) {
    return (
      <Card variant="glass" className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getWeatherIcon(condition, "w-8 h-8")}
          <div>
            <h4 className="text-sm font-semibold">{city}</h4>
            <p className="text-xs text-textSecondary capitalize">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-extrabold text-white">{temp}°C</p>
          <p className="text-[10px] text-accent flex items-center justify-end gap-1">
            <Umbrella className="w-3 h-3" /> {rainProbability}% rain
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="solid" className="bg-card/70 border-white/5 shadow-xl relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Section */}
      <div className="flex flex-col sm:flex-row justify-between gap-6 mb-6">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
            {getWeatherIcon(condition, "w-10 h-10")}
          </div>
          <div>
            <span className="text-xs font-semibold text-accent uppercase tracking-widest font-sora">Live Weather</span>
            <h3 className="text-xl font-bold text-white font-sora mt-0.5">{city}</h3>
            <p className="text-sm text-textSecondary capitalize mt-0.5">{description}</p>
          </div>
        </div>

        <div className="flex items-end sm:items-start flex-col">
          <div className="text-4xl font-black text-white tracking-tight flex items-start">
            {temp}
            <span className="text-xl font-medium text-accent">°C</span>
          </div>
          <span className="text-xs text-textSecondary mt-1">Condition: {condition}</span>
        </div>
      </div>

      {/* Weather Stats Grid */}
      <div className="grid grid-cols-3 gap-3 p-3 bg-white/5 rounded-xl border border-white/5 mb-5 text-center">
        <div>
          <div className="flex justify-center mb-1 text-textSecondary"><Droplets className="w-4 h-4" /></div>
          <p className="text-xs text-textSecondary">Humidity</p>
          <p className="text-sm font-bold text-white mt-0.5">{humidity}%</p>
        </div>
        <div>
          <div className="flex justify-center mb-1 text-textSecondary"><Wind className="w-4 h-4" /></div>
          <p className="text-xs text-textSecondary">Wind Speed</p>
          <p className="text-sm font-bold text-white mt-0.5">{windSpeed} km/h</p>
        </div>
        <div>
          <div className="flex justify-center mb-1 text-textSecondary"><Umbrella className="w-4 h-4" /></div>
          <p className="text-xs text-textSecondary">Rain Prob.</p>
          <p className="text-sm font-bold text-white mt-0.5">{rainProbability}%</p>
        </div>
      </div>

      {/* Forecast Line */}
      <div className="border-t border-white/5 pt-4">
        <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-widest mb-3 font-sora">5-Day Outlook</h4>
        <div className="grid grid-cols-5 gap-2">
          {forecast.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center p-2 rounded-lg bg-white/5 border border-white/5 text-center">
              <span className="text-[10px] text-textSecondary font-medium">{day.date}</span>
              <div className="my-1.5">{getWeatherIcon(day.condition, "w-6 h-6")}</div>
              <span className="text-xs font-bold text-white">{day.temp}°</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Advice Callout */}
      <div className="mt-5 p-3.5 bg-primary/10 border border-primary/20 rounded-xl flex gap-2.5 items-start">
        <Compass className="w-5 h-5 text-primary-light shrink-0 mt-0.5" />
        <div>
          <h5 className="text-xs font-bold text-primary-light uppercase tracking-wider font-sora">Atlas Weather Assistant</h5>
          <p className="text-xs text-textSecondary mt-1 leading-relaxed">
            {getTravelAdvice()}
          </p>
        </div>
      </div>
    </Card>
  );
};
export default WeatherCard;
