import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Button } from '../components/UI';
import { TripCard } from '../components/TripCard';
import { WeatherCard } from '../components/WeatherCard';
import { 
  Plus, 
  TrendingUp, 
  Flame, 
  MapPin, 
  Award, 
  Sparkles, 
  Wallet, 
  Clock,
  Compass,
  Briefcase,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MOCK_TRIPS, MOCK_WEATHER } from '../utils/mockData';
import { Trip, WeatherReport } from '../types';
import { toast } from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const { profile, user, gainXP, updateStreak } = useAuth();
  const navigate = useNavigate();
  
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [weather, setWeather] = useState<WeatherReport>(MOCK_WEATHER.default);
  const [loading, setLoading] = useState(true);

  // Load trips, default populating if empty
  useEffect(() => {
    if (user) {
      // Tick travel login streak
      updateStreak();

      const storedTrips = localStorage.getItem('atlasula_trips');
      let loadedTrips: Trip[] = [];
      
      if (storedTrips) {
        try {
          loadedTrips = JSON.parse(storedTrips);
        } catch (e) {
          console.error(e);
        }
      } else {
        // Pre-populate with Paris mock trip so dashboard looks premium out-of-the-box!
        loadedTrips = MOCK_TRIPS;
        localStorage.setItem('atlasula_trips', JSON.stringify(MOCK_TRIPS));
        toast('We pre-loaded a sample Paris trip to show dashboard visuals!', { icon: '✈️' });
      }

      setTrips(loadedTrips);
      
      if (loadedTrips.length > 0) {
        // Sort by startDate
        const sorted = [...loadedTrips].sort(
          (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
        setActiveTrip(sorted[0]);

        // Resolve weather for destination
        const destLower = sorted[0].destination.toLowerCase();
        if (destLower.includes('paris')) {
          setWeather(MOCK_WEATHER.paris);
        } else if (destLower.includes('tokyo')) {
          setWeather(MOCK_WEATHER.tokyo);
        } else {
          setWeather({
            ...MOCK_WEATHER.default,
            city: sorted[0].destination.split(',')[0]
          });
        }
      }
      setLoading(false);
    }
  }, [user]);

  const handleDeleteTrip = (id: string) => {
    const updated = trips.filter(t => t.id !== id);
    setTrips(updated);
    localStorage.setItem('atlasula_trips', JSON.stringify(updated));
    if (activeTrip?.id === id) {
      const nextActive = updated.length > 0 ? updated[0] : null;
      setActiveTrip(nextActive);
      if (nextActive) {
        const destLower = nextActive.destination.toLowerCase();
        setWeather(destLower.includes('tokyo') ? MOCK_WEATHER.tokyo : destLower.includes('paris') ? MOCK_WEATHER.paris : MOCK_WEATHER.default);
      }
    }
    toast.success('Trip deleted.');
  };

  // XP Progress Calculation
  const getXPThresholds = (level: string) => {
    switch(level) {
      case 'Explorer': return { current: 100, min: 0, max: 500 };
      case 'Navigator': return { current: 500, min: 500, max: 1200 };
      case 'Backpacker': return { current: 1200, min: 1200, max: 2500 };
      case 'Globetrotter': return { current: 2500, min: 2500, max: 5000 };
      case 'Legend': return { current: 5000, min: 5000, max: 10000 };
      default: return { current: 0, min: 0, max: 100 };
    }
  };

  const getXPPercent = () => {
    if (!profile) return 0;
    const { min, max } = getXPThresholds(profile.travelLevel);
    const denominator = max - min;
    const numerator = profile.xp - min;
    return Math.min(Math.round((numerator / denominator) * 100), 100);
  };

  // Next level name
  const getNextLevelName = (level: string) => {
    if (level === 'Explorer') return 'Navigator';
    if (level === 'Navigator') return 'Backpacker';
    if (level === 'Backpacker') return 'Globetrotter';
    if (level === 'Globetrotter') return 'Legend';
    return 'Ultimate';
  };

  // Compile expense data for Recharts
  const getChartData = () => {
    if (!activeTrip || activeTrip.expenses.length === 0) {
      return [
        { name: 'Hotel', amount: 150 },
        { name: 'Food', amount: 80 },
        { name: 'Transport', amount: 40 },
        { name: 'Shopping', amount: 50 },
        { name: 'Entertainment', amount: 20 },
      ];
    }

    const categories: Record<string, number> = {
      Hotel: 0, Food: 0, Transport: 0, Shopping: 0, Emergency: 0, Entertainment: 0
    };

    activeTrip.expenses.forEach(e => {
      if (categories[e.category] !== undefined) {
        categories[e.category] += e.amount;
      }
    });

    return Object.keys(categories)
      .map(cat => ({ name: cat, amount: categories[cat] }))
      .filter(item => item.amount > 0);
  };

  const chartData = getChartData();
  const chartColors = ['#7C5CFF', '#00D4FF', '#22C55E', '#F59E0B', '#EF4444', '#B6C2CF'];

  // Countdown to active trip
  const getCountdownText = () => {
    if (!activeTrip) return '';
    const today = new Date();
    const start = new Date(activeTrip.startDate);
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Currently Traveling ✈️';
    if (diffDays === 0) return 'Departs Today! 🚀';
    if (diffDays === 1) return 'Departs Tomorrow!';
    return `${diffDays} days to departure`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Card & Level Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Welcome Text */}
        <Card variant="glass" className="lg:col-span-7 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-card/80 to-primary/5 p-6 border-white/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-accent uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 animate-pulse-glow" /> Welcome Back
            </div>
            <h1 className="text-3xl font-black text-white font-sora tracking-tight">
              Where to, {profile?.displayName || 'Explorer'}?
            </h1>
            <p className="text-sm text-textSecondary leading-relaxed max-w-xl">
              "Your AI travel companion is ready." Sync your schedules, check weather alerts, review budget limits, or chat with Atlas AI to plan tomorrow's itinerary.
            </p>
          </div>

          <div className="flex gap-4 pt-6">
            <Button variant="primary" className="gap-2 shrink-0 cursor-pointer" onClick={() => navigate('/planner')}>
              <Plus className="w-4 h-4" /> Plan a New Trip
            </Button>
            <Button variant="outline" className="shrink-0 cursor-pointer" onClick={() => navigate('/journal')}>
              Add Journal Entry
            </Button>
          </div>
        </Card>

        {/* Level & XP Gauge */}
        {profile && (
          <Card variant="glass" className="lg:col-span-5 flex flex-col justify-between p-6 border-white/10">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-semibold text-textSecondary uppercase tracking-widest font-sora">Travel Rating</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{profile.travelLevel}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-light">
                <Award className="w-5 h-5" />
              </div>
            </div>

            {/* XP progress bar */}
            <div className="space-y-2 py-4">
              <div className="flex justify-between text-xs font-semibold text-textSecondary">
                <span>XP Level Progress</span>
                <span className="text-white">{profile.xp} XP</span>
              </div>
              <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-700" 
                  style={{ width: `${getXPPercent()}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-textSecondary">
                <span>{getXPThresholds(profile.travelLevel).min} XP</span>
                <span>{getXPPercent()}% toward {getNextLevelName(profile.travelLevel)}</span>
                <span>{getXPThresholds(profile.travelLevel).max} XP</span>
              </div>
            </div>

            {/* Gamification Stats */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-center">
              <div>
                <p className="text-[10px] text-textSecondary font-semibold uppercase tracking-wider">Streak</p>
                <p className="text-sm font-bold text-warning flex items-center justify-center gap-1 mt-0.5">
                  <Flame className="w-4 h-4 animate-pulse" /> {profile.streak} Days
                </p>
              </div>
              <div>
                <p className="text-[10px] text-textSecondary font-semibold uppercase tracking-wider">Trips</p>
                <p className="text-sm font-bold text-white mt-0.5">{profile.tripsCompleted}</p>
              </div>
              <div>
                <p className="text-[10px] text-textSecondary font-semibold uppercase tracking-wider">Countries</p>
                <p className="text-sm font-bold text-accent mt-0.5">{profile.countriesVisited.length || 0}</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Main Grid: Active Trip & Weather & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upcoming Trip Itinerary & Chart */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Trip Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white font-sora flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" /> Active Trip Outline
              </h2>
              {activeTrip && (
                <span className="text-xs bg-primary/20 text-primary-light border border-primary/30 px-3 py-1 rounded-full font-bold">
                  {getCountdownText()}
                </span>
              )}
            </div>

            {activeTrip ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                <div className="md:col-span-6">
                  <TripCard trip={activeTrip} onDelete={handleDeleteTrip} />
                </div>
                {/* Weather details */}
                <div className="md:col-span-6">
                  <WeatherCard weather={weather} />
                </div>
              </div>
            ) : (
              <Card variant="glass" className="p-8 text-center flex flex-col items-center justify-center border-dashed border-white/10 bg-card/20">
                <Compass className="w-10 h-10 text-textSecondary/40 mb-3 animate-spin" style={{ animationDuration: '10s' }} />
                <h3 className="text-sm font-bold text-white">No active trips planned</h3>
                <p className="text-xs text-textSecondary mt-1 max-w-sm">
                  Let's kickstart your vacation. Create a custom itinerary using Gemini AI planner.
                </p>
                <Button variant="primary" size="sm" className="mt-4 gap-1.5 cursor-pointer" onClick={() => navigate('/planner')}>
                  <Plus className="w-3.5 h-3.5" /> Plan Trip
                </Button>
              </Card>
            )}
          </div>

          {/* Budget charts */}
          {activeTrip && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white font-sora flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-light" /> Spending Breakdown: {activeTrip.destination}
              </h2>
              <Card variant="solid" className="p-5 bg-card/60">
                <div className="h-64 w-full">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis 
                          dataKey="name" 
                          stroke="#B6C2CF" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <YAxis 
                          stroke="#B6C2CF" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false} 
                          tickFormatter={(value) => `$${value}`} 
                        />
                        <Tooltip 
                          contentStyle={{ 
                            background: '#161B33', 
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '12px',
                            color: '#fff'
                          }} 
                          formatter={(value) => [`$${value}`, 'Amount Spent']}
                        />
                        <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-textSecondary">
                      No logged expenses for this trip yet.
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Right Column: Quick Shortcuts & Streak Activities */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Shortcuts */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white font-sora">Quick Actions</h2>
            <Card variant="glass" className="p-4 grid grid-cols-2 gap-3 border-white/10 bg-card/30">
              <button
                onClick={() => navigate('/planner')}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-primary/20 hover:border-primary/30 transition-all cursor-pointer group"
              >
                <Compass className="w-6 h-6 text-primary-light group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-white mt-2">AI Planner</span>
              </button>

              <button
                onClick={() => navigate('/finance')}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-primary/20 hover:border-primary/30 transition-all cursor-pointer group"
              >
                <Wallet className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-white mt-2">Expenses</span>
              </button>

              <button
                onClick={() => navigate('/packing')}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-primary/20 hover:border-primary/30 transition-all cursor-pointer group"
              >
                <Briefcase className="w-6 h-6 text-warning group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-white mt-2">Packing List</span>
              </button>

              <button
                onClick={() => navigate('/safety')}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-primary/20 hover:border-primary/30 transition-all cursor-pointer group"
              >
                <ShieldCheck className="w-6 h-6 text-success group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-white mt-2">Safety SOS</span>
              </button>
            </Card>
          </div>

          {/* Daily Challenges */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white font-sora">Daily Challenges</h2>
            <Card variant="solid" className="p-4 bg-card/65 space-y-3.5 border-white/5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent shrink-0 mt-0.5">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Create a short trip outline</h4>
                  <p className="text-[10px] text-textSecondary mt-0.5">Generate a weekend itinerary using AI. (+100 XP)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-warning/20 border border-warning/30 flex items-center justify-center text-warning shrink-0 mt-0.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Maintain login streak</h4>
                  <p className="text-[10px] text-textSecondary mt-0.5">Log in tomorrow to keep the flame burning. (+50 XP)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary-light shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Add a memory entry</h4>
                  <p className="text-[10px] text-textSecondary mt-0.5">Log a highlight inside your scrapbook journal. (+100 XP)</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Trips list */}
          {trips.length > 1 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white font-sora">Recent Travels</h2>
              <Card variant="solid" className="p-4 bg-card/40 border-white/5 space-y-3">
                {trips.slice(1, 4).map((t) => (
                  <div 
                    key={t.id} 
                    className="flex justify-between items-center p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => navigate('/planner', { state: { activeTripId: t.id } })}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">{t.destination}</h4>
                      <p className="text-[10px] text-textSecondary mt-0.5">
                        {new Date(t.startDate).toLocaleDateString()} • {t.days} Days
                      </p>
                    </div>
                    <MapPin className="w-4 h-4 text-textSecondary/40" />
                  </div>
                ))}
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
