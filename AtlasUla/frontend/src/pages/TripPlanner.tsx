import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input } from '../components/UI';
import { 
  Compass, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  Heart,
  Plane,
  AlertCircle,
  Clock,
  ExternalLink,
  Save,
  RotateCcw
} from 'lucide-react';
import { tripService } from '../services/api';
import { Trip, DayItinerary, PackingItem, Expense, BudgetAllocation } from '../types';
import { toast } from 'react-hot-toast';

export const TripPlanner: React.FC = () => {
  const { user, gainXP, unlockAchievement } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Load state (e.g., if navigating from Dashboard to view a saved trip)
  const activeTripIdFromState = (location.state as any)?.activeTripId;

  // Form State
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budgetTier, setBudgetTier] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  const [travelType, setTravelType] = useState<'solo' | 'couple' | 'family' | 'friends'>('solo');
  const [travelStyle, setTravelStyle] = useState<'adventure' | 'cultural' | 'relaxation' | 'foodie' | 'balanced'>('balanced');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  // App Logic States
  const [loading, setLoading] = useState(false);
  const [generatedTrip, setGeneratedTrip] = useState<any | null>(null);
  const [viewingSavedTrip, setViewingSavedTrip] = useState<Trip | null>(null);
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true });

  // Load existing trip if ID provided
  useEffect(() => {
    const loadSavedTrip = async () => {
      if (activeTripIdFromState) {
        try {
          const trips = await tripService.getTrips();
          const match = trips.find(t => t.id === activeTripIdFromState);
          if (match) {
            setViewingSavedTrip(match);
            setGeneratedTrip(null);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    loadSavedTrip();
  }, [activeTripIdFromState]);

  const interestOptions = ['History', 'Food', 'Art', 'Shopping', 'Adventure', 'Relaxation', 'Nature', 'Nightlife'];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleDayExpansion = (dayNum: number) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayNum]: !prev[dayNum]
    }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      toast.error('Please enter a destination.');
      return;
    }
    
    setLoading(true);
    setViewingSavedTrip(null);
    setGeneratedTrip(null);

    try {
      const plan = await tripService.generateItinerary({
        destination,
        days,
        budgetTier,
        travelType,
        interests: selectedInterests,
        travelStyle
      });
      setGeneratedTrip(plan);
      setExpandedDays({ 1: true });
      toast.success('Itinerary generated with AI!');
      gainXP(150); // XP for planning
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate itinerary. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!generatedTrip) return;

    // Compute budget breakdown allocation numbers
    const totalAmount = budgetTier === 'budget' ? 300 * days : budgetTier === 'luxury' ? 1200 * days : 600 * days;
    const dist = generatedTrip.budgetDistribution || { Hotel: 0.45, Food: 0.25, Transport: 0.12, Shopping: 0.08, Emergency: 0.05, Entertainment: 0.05 };
    
    const budget: BudgetAllocation = {
      total: totalAmount,
      Hotel: Math.round(totalAmount * dist.Hotel),
      Food: Math.round(totalAmount * dist.Food),
      Transport: Math.round(totalAmount * dist.Transport),
      Shopping: Math.round(totalAmount * dist.Shopping),
      Emergency: Math.round(totalAmount * dist.Emergency),
      Entertainment: Math.round(totalAmount * dist.Entertainment),
    };

    // Build saved expenses from itinerary morning/afternoon/evening costs
    const initialExpenses: Expense[] = [];
    
    generatedTrip.itinerary.forEach((day: any) => {
      // Simulate hotel lodging charge on day 1
      if (day.dayNumber === 1) {
        initialExpenses.push({
          id: 'hotel_lodging',
          title: `Hotel Stay in ${generatedTrip.destination}`,
          amount: budget.Hotel,
          category: 'Hotel',
          date: new Date().toISOString().split('T')[0]
        });
      }
      
      // Accumulate daily sightseeing/activities as initial entertainment expenses
      const dailyEntCost = (day.morning.cost || 0) + (day.afternoon.cost || 0);
      if (dailyEntCost > 0) {
        initialExpenses.push({
          id: `ent_day_${day.dayNumber}`,
          title: `Day ${day.dayNumber} Sightseeing & Entrance Fees`,
          amount: dailyEntCost,
          category: 'Entertainment',
          date: new Date().toISOString().split('T')[0]
        });
      }

      // Daily food expenses
      const dailyFoodCost = day.evening.cost || 0;
      if (dailyFoodCost > 0) {
        initialExpenses.push({
          id: `food_day_${day.dayNumber}`,
          title: `Day ${day.dayNumber} Dining & Street Food`,
          amount: dailyFoodCost,
          category: 'Food',
          date: new Date().toISOString().split('T')[0]
        });
      }
    });

    const newTrip: Trip = {
      id: 'trip_' + Math.random().toString(36).substring(2, 9),
      destination: generatedTrip.destination,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      days,
      budgetTier,
      travelType,
      interests: selectedInterests,
      travelStyle,
      itinerary: generatedTrip.itinerary,
      packingList: generatedTrip.packingSuggestions.map((p: any, idx: number) => ({
        id: `pack_${idx}`,
        name: p.name,
        category: p.category || 'Essentials',
        packed: false,
        weatherSensitive: p.weatherSensitive
      })),
      expenses: initialExpenses,
      budget,
      aiTravelTips: generatedTrip.aiTravelTips,
      safetyScore: generatedTrip.safetyScore || 85,
      createdAt: new Date().toISOString()
    };

    try {
      await tripService.saveTrip(newTrip);
      toast.success('Trip saved successfully!');
      gainXP(200); // 200 XP for saving trip!
      
      // Check achievements
      unlockAchievement('first_trip');
      if (days <= 3) unlockAchievement('weekend_warrior');
      if (travelType === 'solo') unlockAchievement('solo_traveler');
      if (travelStyle === 'adventure') unlockAchievement('adventure_seeker');

      navigate('/dashboard');
    } catch (e) {
      toast.error('Failed to save trip.');
    }
  };

  const tripToDisplay = viewingSavedTrip || generatedTrip;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-sora">AI Travel Planner</h1>
          <p className="text-xs text-textSecondary mt-1">Design weather-smart, custom itineraries with Gemini</p>
        </div>
        {viewingSavedTrip && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setViewingSavedTrip(null);
              setGeneratedTrip(null);
              setDestination('');
            }}
            className="gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Plan Another
          </Button>
        )}
      </div>

      {/* Conditional Layout */}
      {!tripToDisplay ? (
        /* Plan Creation Form */
        <div className="max-w-2xl mx-auto">
          {loading ? (
            /* Loading State */
            <Card variant="glass" className="p-12 text-center space-y-6 flex flex-col items-center justify-center border-white/10 min-h-[400px]">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <Sparkles className="w-6 h-6 absolute top-5 left-5 text-accent animate-pulse-glow" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white font-sora animate-pulse">Consulting Atlas AI...</h3>
                <p className="text-xs text-textSecondary max-w-sm leading-relaxed">
                  Analyzing local weather reports, safety files, optimal transit maps, and curating daily hotspots for {destination || 'your destination'}...
                </p>
              </div>
            </Card>
          ) : (
            <Card variant="solid" className="p-8 border-white/5 bg-card/60">
              <form onSubmit={handleGenerate} className="space-y-6">
                {/* Destination Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider font-sora">Where are we going?</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-primary-light" />
                    <input
                      type="text"
                      placeholder="e.g. Paris, France; Kyoto, Japan"
                      required
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full glass-input rounded-xl pl-12 pr-4 py-3 text-sm font-medium focus:outline-none"
                    />
                  </div>
                </div>

                {/* Days and Budget Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider font-sora">Duration (Days)</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-accent" />
                      <input
                        type="number"
                        min={1}
                        max={14}
                        required
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                        className="w-full glass-input rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider font-sora">Budget Tier</label>
                    <select
                      value={budgetTier}
                      onChange={(e: any) => setBudgetTier(e.target.value)}
                      className="w-full glass-input rounded-xl px-4 py-3 text-sm font-medium focus:outline-none cursor-pointer"
                    >
                      <option value="budget">💰 Budget (Low Cost)</option>
                      <option value="moderate">💵 Moderate (Mid Range)</option>
                      <option value="luxury">💎 Luxury (Premium)</option>
                    </select>
                  </div>
                </div>

                {/* Travel Type and Style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider font-sora">Travel Group</label>
                    <select
                      value={travelType}
                      onChange={(e: any) => setTravelType(e.target.value)}
                      className="w-full glass-input rounded-xl px-4 py-3 text-sm font-medium focus:outline-none cursor-pointer"
                    >
                      <option value="solo">🚶 Solo Traveler</option>
                      <option value="couple">💑 Couple / Romantic</option>
                      <option value="family">👨‍👩‍👧‍👦 Family Vacation</option>
                      <option value="friends">👯 Friend Group</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider font-sora">Travel Style</label>
                    <select
                      value={travelStyle}
                      onChange={(e: any) => setTravelStyle(e.target.value)}
                      className="w-full glass-input rounded-xl px-4 py-3 text-sm font-medium focus:outline-none cursor-pointer"
                    >
                      <option value="balanced">⚖️ Balanced Pace</option>
                      <option value="adventure">🧗 Adventure / Outdoors</option>
                      <option value="cultural">🎨 Cultural & Art</option>
                      <option value="relaxation">🏖️ Relaxation & Leisure</option>
                      <option value="foodie">🍜 Foodie Gastronomy</option>
                    </select>
                  </div>
                </div>

                {/* Interests Chips */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider font-sora">Select Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((interest) => {
                      const selected = selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 cursor-pointer ${
                            selected
                              ? 'bg-primary text-white border-primary glow-primary'
                              : 'bg-white/5 border-white/5 text-textSecondary hover:bg-white/10'
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Form Submit */}
                <Button
                  type="submit"
                  variant="accent"
                  fullWidth
                  className="gap-2 text-background font-bold cursor-pointer"
                >
                  <Sparkles className="w-5 h-5" /> Generate AI Itinerary
                </Button>
              </form>
            </Card>
          )}
        </div>
      ) : (
        /* Itinerary Results Viewer */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Itinerary Day List */}
          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-xl font-bold font-sora text-white flex items-center gap-2 mb-2">
              <Compass className="w-6 h-6 text-primary-light" /> Day-Wise Itinerary
            </h2>

            {tripToDisplay.itinerary.map((day: DayItinerary) => {
              const expanded = expandedDays[day.dayNumber];
              return (
                <Card 
                  key={day.dayNumber} 
                  variant="solid" 
                  className="bg-card/50 border-white/5 overflow-hidden transition-all duration-300"
                >
                  {/* Collapsible Header */}
                  <div 
                    onClick={() => toggleDayExpansion(day.dayNumber)}
                    className="flex justify-between items-center p-4 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border-b border-white/5"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-accent uppercase tracking-widest font-sora">Day {day.dayNumber}</span>
                      <h3 className="text-sm font-bold text-white mt-0.5">{day.title}</h3>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <span className="text-[10px] bg-white/5 px-2.5 py-1 rounded-full text-textSecondary font-semibold border border-white/5">
                        Est. Cost: ${day.estimatedCost}
                      </span>
                      {expanded ? <ChevronUp className="w-4 h-4 text-textSecondary" /> : <ChevronDown className="w-4 h-4 text-textSecondary" />}
                    </div>
                  </div>

                  {/* Expanded activities details */}
                  {expanded && (
                    <div className="p-5 space-y-5">
                      {/* Morning Activity */}
                      <div className="border-l-2 border-primary-light pl-4 py-0.5">
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <span className="text-[9px] font-bold tracking-wider text-primary-light uppercase">Morning</span>
                            <h4 className="text-xs font-bold text-white mt-0.5">{day.morning.title}</h4>
                          </div>
                          <span className="text-[10px] text-textSecondary font-medium shrink-0">${day.morning.cost} • {day.morning.duration}</span>
                        </div>
                        <p className="text-xs text-textSecondary mt-1.5 leading-relaxed">{day.morning.description}</p>
                      </div>

                      {/* Afternoon Activity */}
                      <div className="border-l-2 border-accent pl-4 py-0.5">
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <span className="text-[9px] font-bold tracking-wider text-accent uppercase">Afternoon</span>
                            <h4 className="text-xs font-bold text-white mt-0.5">{day.afternoon.title}</h4>
                          </div>
                          <span className="text-[10px] text-textSecondary font-medium shrink-0">${day.afternoon.cost} • {day.afternoon.duration}</span>
                        </div>
                        <p className="text-xs text-textSecondary mt-1.5 leading-relaxed">{day.afternoon.description}</p>
                      </div>

                      {/* Evening Activity */}
                      <div className="border-l-2 border-warning pl-4 py-0.5">
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <span className="text-[9px] font-bold tracking-wider text-warning uppercase">Evening</span>
                            <h4 className="text-xs font-bold text-white mt-0.5">{day.evening.title}</h4>
                          </div>
                          <span className="text-[10px] text-textSecondary font-medium shrink-0">${day.evening.cost} • {day.evening.duration}</span>
                        </div>
                        <p className="text-xs text-textSecondary mt-1.5 leading-relaxed">{day.evening.description}</p>
                      </div>

                      {/* Day Footer info */}
                      <div className="pt-3 border-t border-white/5 flex flex-wrap justify-between items-center text-[10px] text-textSecondary gap-2">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-accent" /> {day.travelTime}</span>
                        {day.alternativePlan && (
                          <span className="bg-warning/15 border border-warning/20 text-warning px-2.5 py-1 rounded-lg max-w-md italic leading-relaxed">
                            💡 Backup: {day.alternativePlan}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Right Column: AI Travel Tips, Safety, Save buttons */}
          <div className="lg:col-span-4 space-y-6">
            {/* Actions Panel */}
            {generatedTrip && (
              <Card variant="glass" className="p-5 border-primary/30 glow-primary bg-primary/5">
                <h3 className="font-bold text-sm font-sora text-white flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-accent" /> AI Generation Success
                </h3>
                <p className="text-xs text-textSecondary leading-relaxed mb-4">
                  This plan is ready to sync. Save this trip to automatically log budget allocations, generate a packing list, and unlock rewards.
                </p>
                <div className="flex flex-col gap-2">
                  <Button variant="accent" onClick={handleSaveTrip} className="gap-2 cursor-pointer">
                    <Save className="w-4 h-4" /> Save Trip to Dashboard
                  </Button>
                  <Button variant="outline" onClick={() => { setGeneratedTrip(null); setViewingSavedTrip(null); }} className="cursor-pointer">
                    Adjust Options
                  </Button>
                </div>
              </Card>
            )}

            {/* Travel Safety Summary */}
            <Card variant="solid" className="p-5 bg-card/65 border-white/5 space-y-3.5">
              <h3 className="font-bold text-sm text-white font-sora flex items-center gap-1.5">
                <ShieldAlert className="w-4.5 h-4.5 text-warning" /> Safety Assessment
              </h3>
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <span className="text-xs text-textSecondary">Destination Security Score</span>
                <span className={`text-sm font-black px-2.5 py-0.5 rounded-full border ${
                  (tripToDisplay.safetyScore || 85) >= 90 
                    ? 'bg-success/15 border-success/30 text-success'
                    : 'bg-warning/15 border-warning/30 text-warning'
                }`}>
                  {tripToDisplay.safetyScore || 85}/100
                </span>
              </div>
              <p className="text-[10px] text-textSecondary leading-relaxed">
                Score indicates low safety risk. However, stay alert to petty pickpocketing near primary transit centers and popular tourist monuments.
              </p>
            </Card>

            {/* AI Travel Guidelines */}
            {tripToDisplay.aiTravelTips && tripToDisplay.aiTravelTips.length > 0 && (
              <Card variant="solid" className="p-5 bg-card/60 border-white/5 space-y-3">
                <h3 className="font-bold text-sm text-white font-sora flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-accent" /> AI Travel Guidelines
                </h3>
                <ul className="space-y-2.5">
                  {tripToDisplay.aiTravelTips.map((tip: string, idx: number) => (
                    <li key={idx} className="text-xs text-textSecondary leading-relaxed flex gap-2 items-start">
                      <span className="text-accent shrink-0 select-none">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Maps integration card */}
            <Card variant="solid" className="p-5 bg-card/45 border-white/5 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-accent mx-auto">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">Google Maps Sync</h4>
                <p className="text-[10px] text-textSecondary">Sync daily routes directly with your phone maps.</p>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tripToDisplay.destination)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-accent hover:text-white font-semibold pt-1 transition-colors"
              >
                Launch Google Maps <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripPlanner;
