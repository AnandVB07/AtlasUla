import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components/UI';
import { 
  Utensils, 
  Star, 
  MapPin, 
  Heart, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Flame,
  Check
} from 'lucide-react';
import { MOCK_RESTAURANTS } from '../utils/mockData';
import { Restaurant, Trip } from '../types';
import { toast } from 'react-hot-toast';

export const Restaurants: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS.default);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [eatingSpot, setEatingSpot] = useState<Restaurant | null>(null);

  // Filters
  const [cuisineFilter, setCuisineFilter] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [gemsOnly, setGemsOnly] = useState(false);

  // Load Trips
  useEffect(() => {
    const storedTrips = localStorage.getItem('atlasula_trips');
    if (storedTrips) {
      try {
        const loaded: Trip[] = JSON.parse(storedTrips);
        setTrips(loaded);
        if (loaded.length > 0) {
          setSelectedTrip(loaded[0]);
          resolveRestaurants(loaded[0].destination);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      resolveRestaurants('default');
    }
  }, []);

  const resolveRestaurants = (destination: string) => {
    const destLower = destination.toLowerCase();
    if (destLower.includes('paris')) {
      setRestaurants(MOCK_RESTAURANTS.paris);
    } else if (destLower.includes('tokyo')) {
      setRestaurants(MOCK_RESTAURANTS.tokyo);
    } else {
      setRestaurants(MOCK_RESTAURANTS.default);
    }
  };

  const handleTripChange = (tripId: string) => {
    const match = trips.find(t => t.id === tripId) || null;
    setSelectedTrip(match);
    if (match) {
      resolveRestaurants(match.destination);
    } else {
      resolveRestaurants('default');
    }
  };

  const toggleWishlist = (restId: string) => {
    setWishlist(prev => 
      prev.includes(restId)
        ? prev.filter(id => id !== restId)
        : [...prev, restId]
    );
    const added = !wishlist.includes(restId);
    toast.success(added ? 'Added to food wishlist!' : 'Removed from wishlist.', { id: 'food-wishlist' });
  };

  // Add dining expense
  const handleVisitConfirm = (costAmount: string) => {
    if (!eatingSpot || !selectedTrip || !costAmount) return;

    const price = parseFloat(costAmount);
    if (isNaN(price) || price <= 0) return;

    const storedTrips = localStorage.getItem('atlasula_trips') || '[]';
    const currentTrips: Trip[] = JSON.parse(storedTrips);

    const updatedExpenses = [
      {
        id: 'dining_' + Math.random().toString(36).substring(2, 9),
        title: `Dined at ${eatingSpot.name}`,
        amount: price,
        category: 'Food' as const,
        date: new Date().toISOString().split('T')[0]
      },
      ...selectedTrip.expenses
    ];

    const updatedTrip = {
      ...selectedTrip,
      expenses: updatedExpenses
    };

    const updatedTrips = currentTrips.map(t => t.id === selectedTrip.id ? updatedTrip : t);
    localStorage.setItem('atlasula_trips', JSON.stringify(updatedTrips));
    setSelectedTrip(updatedTrip);

    toast.success(`Log updated! Added $${price} dining charge to Expenses.`, {
      icon: '🍜',
      duration: 3500
    });
    setEatingSpot(null);
  };

  // Apply filters
  const filteredRestaurants = restaurants.filter(r => {
    if (cuisineFilter !== 'All' && !r.cuisine.includes(cuisineFilter)) return false;
    if (vegOnly && !r.isVegetarian) return false;
    if (gemsOnly && !r.isLocalGem) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Selector */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/5 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-sora">Restaurant Explorer</h1>
          <p className="text-xs text-textSecondary mt-1">Discover culinary masterpieces, local food joints, and organic spots.</p>
        </div>

        {trips.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-textSecondary font-medium">Select Destination:</span>
            <select
              value={selectedTrip?.id || ''}
              onChange={(e) => handleTripChange(e.target.value)}
              className="glass-input rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none cursor-pointer bg-card"
            >
              {trips.map(t => (
                <option key={t.id} value={t.id}>📍 {t.destination}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Filters Bar */}
      <Card variant="glass" className="p-4 border-white/5 flex flex-wrap gap-4 items-center justify-between bg-card/20">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-xs text-textSecondary font-medium">Cuisine:</span>
          <select
            value={cuisineFilter}
            onChange={(e) => setCuisineFilter(e.target.value)}
            className="glass-input rounded-xl px-3 py-1.5 text-xs focus:outline-none bg-card cursor-pointer"
          >
            <option value="All">All Cuisines</option>
            <option value="Organic">Organic</option>
            <option value="Bistro">French Bistro</option>
            <option value="Sushi">Sushi Omakase</option>
            <option value="Asian">Asian Street Noodles</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2 text-xs font-semibold text-textSecondary cursor-pointer">
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => setVegOnly(e.target.checked)}
              className="accent-primary w-4.5 h-4.5 rounded border-white/10 bg-white/5"
            />
            Vegetarian / Vegan
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-textSecondary cursor-pointer">
            <input
              type="checkbox"
              checked={gemsOnly}
              onChange={(e) => setGemsOnly(e.target.checked)}
              className="accent-primary w-4.5 h-4.5 rounded border-white/10 bg-white/5"
            />
            Hidden Gems Only
          </label>
        </div>
      </Card>

      {/* Main Grid: Restaurant list and sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Restaurants Cards */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-lg font-bold text-white font-sora flex items-center gap-2">
            <Utensils className="w-5 h-5 text-primary-light" /> Gastronomy Places
          </h2>

          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredRestaurants.map((rest) => {
                const inWishlist = wishlist.includes(rest.id);
                return (
                  <Card 
                    key={rest.id} 
                    variant="solid" 
                    className="bg-card/55 border-white/5 p-4 flex flex-col justify-between hover:border-primary/25 transition-all duration-300"
                  >
                    <div className="space-y-3.5">
                      {/* Pic */}
                      <div className="h-44 rounded-xl overflow-hidden relative bg-white/5">
                        <img 
                          src={rest.image} 
                          alt={rest.name} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <button
                          onClick={() => toggleWishlist(rest.id)}
                          className={`absolute top-2 right-2 p-2 rounded-lg backdrop-blur-md border transition-all cursor-pointer ${
                            inWishlist 
                              ? 'bg-primary/20 border-primary/30 text-primary-light' 
                              : 'bg-background/40 border-white/5 text-textSecondary hover:text-white'
                          }`}
                        >
                          <Heart className="w-4 h-4" fill={inWishlist ? 'currentColor' : 'none'} />
                        </button>
                        
                        {rest.isLocalGem && (
                          <span className="absolute bottom-2 left-2 px-2.5 py-0.5 text-[9px] font-bold tracking-wider bg-accent/90 text-background rounded-md uppercase font-sora">
                            💎 Hidden Gem
                          </span>
                        )}
                      </div>

                      {/* Header info */}
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="text-sm font-bold text-white font-sora">{rest.name}</h3>
                          <span className="text-xs font-black text-accent">{rest.priceRange}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[9px] text-textSecondary mt-1.5">
                          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-warning fill-warning" /> {rest.rating}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-accent" /> {rest.distance}</span>
                        </div>
                      </div>

                      <p className="text-xs text-textSecondary leading-relaxed min-h-[40px]">
                        {rest.description}
                      </p>
                    </div>

                    {/* Footer buttons */}
                    <div className="flex justify-between items-center gap-2 pt-3 border-t border-white/5 mt-4">
                      <span className="text-[10px] bg-white/5 text-textSecondary border border-white/5 px-2.5 py-0.5 rounded-lg">{rest.cuisine}</span>
                      {selectedTrip ? (
                        <button
                          onClick={() => setEatingSpot(rest)}
                          className="text-xs text-accent hover:text-white font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          Record dining <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[9px] text-textSecondary italic">Save trip to log dining</span>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card variant="glass" className="p-8 text-center text-xs text-textSecondary border-dashed border-white/10 bg-card/25">
              No eateries match the selected criteria. Try adjusting the toggles!
            </Card>
          )}
        </div>

        {/* Local Gastronomy Facts */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-lg font-bold text-white font-sora">Culinary Guide</h2>
          <Card variant="solid" className="p-5 bg-card/65 border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-warning">
              <Flame className="w-5 h-5" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-sora">Atlas Foodie Challenges</h3>
            </div>
            
            <div className="space-y-3 pt-1">
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs space-y-1.5">
                <h4 className="font-bold text-white">🏆 Food Explorer Challenge</h4>
                <p className="text-[10px] text-textSecondary leading-normal">
                  Log dining spots inside 3 journal entries to unlock the **Food Explorer** badge (+200 XP).
                </p>
              </div>

              <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs space-y-1.5">
                <h4 className="font-bold text-white">💡 Pro Tip: Custom Request</h4>
                <p className="text-[10px] text-textSecondary leading-normal">
                  Use Atlas AI Chat in the corner and type *“Suggest low cost dinners near my hotel”* to get immediate gastropub matches!
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Record Expense Dialog */}
      {eatingSpot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setEatingSpot(null)} />
          <Card variant="glass" className="w-full max-w-md relative z-10 border-white/10 p-6 space-y-4 transform animate-float">
            <div>
              <h3 className="font-bold text-sm font-sora text-white">Log Dining Expense</h3>
              <p className="text-[10px] text-textSecondary mt-0.5">Dine-in at {eatingSpot.name}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider font-sora">Dining Cost ($)</label>
                <input
                  type="number"
                  placeholder="30"
                  defaultValue={eatingSpot.priceRange === '$' ? '15' : eatingSpot.priceRange === '$$' ? '40' : '90'}
                  id="diningCostInput"
                  className="w-full glass-input rounded-xl px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={() => {
                    const inputVal = (document.getElementById('diningCostInput') as HTMLInputElement)?.value;
                    handleVisitConfirm(inputVal);
                  }}
                  variant="primary" 
                  className="flex-1 cursor-pointer"
                >
                  Save Log
                </Button>
                <Button type="button" variant="outline" onClick={() => setEatingSpot(null)} className="cursor-pointer">Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Restaurants;
