import {
Cloud,
CloudLightning,
CloudRain,
CloudSun,
Droplets,
Sun,
Wind
} from 'lucide-react';
import React from 'react';
import { WeatherReport } from '../types';
import { Card } from './UI';

interface WeatherCardProps {
  weather: WeatherReport;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  // Resolve icons dynamically
  const getWeatherIcon = (iconName: string, sizeClass = 'w-6 h-6') => {
    switch (iconName) {
      case 'Sun': return <Sun className={`${sizeClass} text-warning`} />;
      case 'CloudSun': return <CloudSun className={`${sizeClass} text-accent`} />;
      case 'CloudRain': return <CloudRain className={`${sizeClass} text-primary-light`} />;
      case 'Cloud': return <Cloud className={`${sizeClass} text-textSecondary`} />;
      case 'CloudLightning': return <CloudLightning className={`${sizeClass} text-error`} />;
      default: return <CloudSun className={`${sizeClass} text-textSecondary`} />;
    }
  };

  return (
    <Card variant="solid" className="bg-card/50 border-white/5 p-5 flex flex-col justify-between h-full hover:border-primary/20 transition-all duration-300 select-none">
      {/* Current Conditions Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div>
            <span className="text-[9px] bg-accent/25 text-accent border border-accent/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-sora">
              Weather Status
            </span>
            <h3 className="text-sm font-bold text-white font-sora mt-1">📍 {weather.city}</h3>
          </div>
          {getWeatherIcon(weather.icon, 'w-10 h-10 animate-float')}
        </div>

        {/* Big Temperature Indicator */}
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-white font-sora">{weather.temp}°C</span>
          <span className="text-xs text-textSecondary font-semibold">{weather.condition}</span>
        </div>

        {/* Descriptive overview */}
        <p className="text-[11px] text-textSecondary leading-relaxed italic">
          "{weather.description}"
        </p>

        {/* Environmental stats */}
        <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-3 text-center">
          <div>
            <p className="text-[9px] text-textSecondary font-semibold uppercase tracking-wider">Humidity</p>
            <p className="text-xs font-bold text-white mt-0.5 flex items-center justify-center gap-0.5">
              <Droplets className="w-3.5 h-3.5 text-accent shrink-0" /> {weather.humidity}%
            </p>
          </div>
          <div>
            <p className="text-[9px] text-textSecondary font-semibold uppercase tracking-wider">Wind Speed</p>
            <p className="text-xs font-bold text-white mt-0.5 flex items-center justify-center gap-0.5">
              <Wind className="w-3.5 h-3.5 text-primary-light shrink-0" /> {weather.windSpeed} km/h
            </p>
          </div>
          <div>
            <p className="text-[9px] text-textSecondary font-semibold uppercase tracking-wider">Precipitation</p>
            <p className="text-xs font-bold text-white mt-0.5">{weather.rainProbability}%</p>
          </div>
        </div>
      </div>

      {/* 5-Day Outlook horizontal list */}
      <div className="border-t border-white/5 pt-4 mt-4 space-y-2">
        <h4 className="text-[9px] font-bold uppercase tracking-wider text-textSecondary font-sora">5-Day Outlook</h4>
        <div className="flex justify-between items-center gap-2 overflow-x-auto no-scrollbar">
          {weather.forecast.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-white/5 text-center shrink-0 min-w-[55px]">
              <span className="text-[9px] font-semibold text-textSecondary">{day.date}</span>
              <div className="py-1">{getWeatherIcon(day.icon, 'w-4.5 h-4.5')}</div>
              <span className="text-[10px] font-bold text-white mt-0.5">{day.temp}°</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default WeatherCard;
