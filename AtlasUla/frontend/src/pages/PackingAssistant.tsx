import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input } from '../components/UI';
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  CheckSquare, 
  Square,
  Sparkles,
  AlertCircle,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { Trip, PackingItem } from '../types';
import { tripService } from '../services/api';
import { toast } from 'react-hot-toast';

export const PackingAssistant: React.FC = () => {
  const { user, gainXP, unlockAchievement } = useAuth();
  const location = useLocation();

  // Trips lists
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // New Custom Item state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'Essentials' | 'Clothing' | 'Toiletries' | 'Electronics' | 'Activities' | 'Other'>('Essentials');

  // Load Trips
  const loadTripsData = async () => {
    try {
      const loaded = await tripService.getTrips();
      setTrips(loaded);

      const stateTripId = (location.state as any)?.tripId;
      const match = stateTripId 
        ? loaded.find(t => t.id === stateTripId) 
        : loaded[0];

      setSelectedTrip(match || null);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user) {
      loadTripsData();
    }
  }, [user, location.state]);

  if (trips.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
        <Briefcase className="w-16 h-16 text-textSecondary/20 animate-bounce" />
        <h2 className="text-xl font-bold text-white font-sora">No active checklists found</h2>
        <p className="text-xs text-textSecondary max-w-sm">
          Please plan a trip using the AI Planner to automatically generate a weather-smart packing checklist!
        </p>
      </div>
    );
  }

  const handleTripChange = (tripId: string) => {
    const match = trips.find(t => t.id === tripId) || null;
    setSelectedTrip(match);
  };

  // Toggle item packed status via REST API
  const handleToggleItem = async (itemId: string) => {
    if (!selectedTrip) return;

    try {
      const updatedTrip = await tripService.togglePackingItem(selectedTrip.id, itemId);
      
      const updatedTrips = trips.map(t => t.id === selectedTrip.id ? updatedTrip : t);
      setTrips(updatedTrips);
      setSelectedTrip(updatedTrip);

      // Check achievements
      const allPacked = updatedTrip.packingList.every(i => i.packed);
      if (allPacked && updatedTrip.packingList.length > 0) {
        unlockAchievement('packing_pro');
      }
    } catch (err) {
      toast.error('Failed to update packing status.');
    }
  };

  // Delete checklist item via REST API
  const handleDeleteItem = async (itemId: string) => {
    if (!selectedTrip) return;
    try {
      const updatedTrip = await tripService.deletePackingItem(selectedTrip.id, itemId);
      
      const updatedTrips = trips.map(t => t.id === selectedTrip.id ? updatedTrip : t);
      setTrips(updatedTrips);
      setSelectedTrip(updatedTrip);
      toast.success('Item deleted.');
    } catch (err) {
      toast.error('Failed to delete packing item.');
    }
  };

  // Add custom item via REST API
  const handleAddItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip || !newItemName.trim()) return;

    const newItem: PackingItem = {
      id: 'pack_' + Math.random().toString(36).substring(2, 9),
      name: newItemName,
      category: newItemCategory,
      packed: false
    };

    try {
      const updatedTrip = await tripService.addPackingItem(selectedTrip.id, newItem);
      
      const updatedTrips = trips.map(t => t.id === selectedTrip.id ? updatedTrip : t);
      setTrips(updatedTrips);
      setSelectedTrip(updatedTrip);

      setNewItemName('');
      toast.success('Custom item added.');
      gainXP(15);
    } catch (err) {
      toast.error('Failed to add custom packing item.');
    }
  };

  // Calculate statistics
  const list = selectedTrip?.packingList || [];
  const packedCount = list.filter(i => i.packed).length;
  const totalCount = list.length;
  const percentPacked = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  // Group items by category
  const categories = ['Essentials', 'Clothing', 'Toiletries', 'Electronics', 'Activities', 'Other'] as const;
  const getItemsByCategory = (cat: string) => {
    return list.filter(i => i.category === cat);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Selector Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/5 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-sora">Packing Assistant</h1>
          <p className="text-xs text-textSecondary mt-1">Smart travel checklists automatically adapted to destination climates.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-textSecondary font-medium">Select Trip:</span>
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
      </div>

      {selectedTrip && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Packing list categories */}
          <div className="lg:col-span-8 space-y-6">
            {/* Progress Meter */}
            <Card variant="glass" className="p-5 border-white/10 relative overflow-hidden bg-gradient-to-r from-card/85 to-success/5">
              <div className="absolute top-0 right-0 w-24 h-24 bg-success/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex justify-between items-center mb-2.5">
                <div>
                  <h3 className="text-sm font-bold text-white font-sora">Checklist Progress</h3>
                  <p className="text-[10px] text-textSecondary mt-0.5">{packedCount} of {totalCount} items loaded</p>
                </div>
                <span className="text-xl font-extrabold text-success font-sora">{percentPacked}%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-success rounded-full transition-all duration-500" 
                  style={{ width: `${percentPacked}%` }}
                />
              </div>
            </Card>

            {/* List by categories */}
            <div className="space-y-5">
              {categories.map((cat) => {
                const catItems = getItemsByCategory(cat);
                if (catItems.length === 0) return null;

                return (
                  <div key={cat} className="space-y-2">
                    <h3 className="text-xs font-bold text-textSecondary uppercase tracking-widest font-sora">{cat}</h3>
                    <Card variant="solid" className="p-3 bg-card/55 border-white/5 space-y-1">
                      {catItems.map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => handleToggleItem(item.id)}
                          className="flex justify-between items-center p-2.5 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {item.packed ? (
                              <CheckSquare className="w-4.5 h-4.5 text-success shrink-0" />
                            ) : (
                              <Square className="w-4.5 h-4.5 text-textSecondary shrink-0" />
                            )}
                            <span className={`text-xs font-medium ${item.packed ? 'text-textSecondary/40 line-through' : 'text-white'}`}>
                              {item.name}
                            </span>
                            {item.weatherSensitive && (
                              <span className="text-[9px] bg-accent/15 border border-accent/20 text-accent font-semibold px-2 py-0.5 rounded-full leading-none flex items-center gap-0.5">
                                ☁️ Weather Aware
                              </span>
                            )}
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItem(item.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded bg-white/5 text-textSecondary hover:text-error hover:bg-error/15 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Custom Item & AI Tips */}
          <div className="lg:col-span-4 space-y-6">
            {/* Add Custom Item */}
            <Card variant="solid" className="p-5 bg-card/65 border-white/5">
              <h3 className="font-bold text-sm text-white font-sora flex items-center gap-1.5 mb-3.5">
                <Plus className="w-4.5 h-4.5 text-primary-light" /> Custom Item
              </h3>
              <form onSubmit={handleAddItemSubmit} className="space-y-4">
                <Input
                  placeholder="e.g. Swimsuits, hiking hat"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-semibold text-textSecondary uppercase tracking-wider font-sora">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e: any) => setNewItemCategory(e.target.value)}
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none bg-card cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <Button type="submit" variant="primary" fullWidth className="text-xs h-9 cursor-pointer">
                  Add to Checklist
                </Button>
              </form>
            </Card>

            {/* AI Packing advisor tips */}
            <Card variant="solid" className="p-5 bg-card/65 border-white/5 space-y-3.5">
              <div className="flex items-center gap-2 text-accent">
                <Sparkles className="w-5 h-5 animate-pulse-glow" />
                <h3 className="text-xs font-bold uppercase tracking-wider font-sora">AI Packing Insights</h3>
              </div>
              <div className="space-y-3 pt-1">
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs leading-relaxed text-textSecondary flex gap-2 items-start">
                  <CheckCircle2 className="w-4.5 h-4.5 text-success shrink-0" />
                  <span>
                    <strong>Weather Check</strong>: Based on the predicted precipitation in {selectedTrip.destination}, we pre-loaded and tagged water-sensitive accessories like jackets and umbrellas.
                  </span>
                </div>

                <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs leading-relaxed text-textSecondary flex gap-2 items-start">
                  <CheckCircle2 className="w-4.5 h-4.5 text-success shrink-0" />
                  <span>
                    <strong>Duration Multiplier</strong>: Recommended quantities are automatically scaled for a {selectedTrip.days}-day stay.
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackingAssistant;
