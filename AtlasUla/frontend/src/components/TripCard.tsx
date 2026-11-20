import {
Calendar,
MapPin,
Navigation,
Trash2,
TrendingDown
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trip } from '../types';
import { Button,Card } from './UI';

interface TripCardProps {
  trip: Trip;
  onDelete?: (id: string) => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onDelete }) => {
  const navigate = useNavigate();

  // Date formatting helpers
  const start = new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const end = new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  const totalSpent = trip.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalBudget = trip.budget.total;
  const percentSpent = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100) : 0;

  return (
    <Card variant="solid" className="bg-card/50 border-white/5 p-5 flex flex-col justify-between h-full hover:border-primary/20 transition-all duration-300 relative group">
      <div className="space-y-4">
        {/* Header Title */}
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <span className="text-[9px] bg-primary/20 text-primary-light border border-primary/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-sora">
              ✈️ {trip.days} Days
            </span>
            <h3 className="text-sm font-bold text-white font-sora mt-1 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-accent" /> {trip.destination}
            </h3>
          </div>
          
          {onDelete && (
            <button
              onClick={() => onDelete(trip.id)}
              className="p-1.5 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 text-textSecondary hover:text-error hover:bg-error/10 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Date details */}
        <div className="flex items-center gap-1.5 text-[10px] text-textSecondary font-semibold">
          <Calendar className="w-3.5 h-3.5 text-textSecondary/50" />
          <span>{start} - {end}</span>
        </div>

        {/* Budget Progress bar */}
        <div className="space-y-1.5 pt-2 border-t border-white/5">
          <div className="flex justify-between text-[10px] font-semibold text-textSecondary">
            <span>Expenses Tracking</span>
            <span className={totalSpent > totalBudget ? 'text-error font-extrabold' : 'text-white'}>
              ${totalSpent} / ${totalBudget} ({percentSpent}%)
            </span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${totalSpent > totalBudget ? 'bg-error' : 'bg-accent'}`}
              style={{ width: `${percentSpent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex gap-2 pt-4 mt-4 border-t border-white/5">
        <Button 
          variant="primary" 
          size="sm" 
          className="flex-1 text-[11px] gap-1 cursor-pointer"
          onClick={() => navigate('/planner', { state: { activeTripId: trip.id } })}
        >
          <Navigation className="w-3.5 h-3.5" /> View Itinerary
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-[11px] gap-1 cursor-pointer"
          onClick={() => navigate('/finance', { state: { tripId: trip.id } })}
        >
          <TrendingDown className="w-3.5 h-3.5" /> Budget
        </Button>
      </div>
    </Card>
  );
};

export default TripCard;
