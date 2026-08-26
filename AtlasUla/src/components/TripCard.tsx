import React from 'react';
import { Card, Button } from './UI';
import { Calendar, Wallet, Briefcase, ChevronRight, Trash2 } from 'lucide-react';
import { Trip } from '../types';
import { useNavigate } from 'react-router-dom';

interface TripCardProps {
  trip: Trip;
  onDelete?: (id: string) => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onDelete }) => {
  const navigate = useNavigate();

  // Calculate budget statistics
  const totalBudget = trip.budget.total;
  const spentBudget = trip.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const percentSpent = totalBudget > 0 ? Math.min(Math.round((spentBudget / totalBudget) * 100), 100) : 0;

  // Format date range
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit'
    });
  };

  // Get budget safety color
  const getProgressColor = () => {
    if (percentSpent > 90) return 'bg-error';
    if (percentSpent > 75) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <Card variant="glow" className="overflow-hidden flex flex-col group h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors font-sora">
            {trip.destination}
          </h3>
          <p className="text-xs text-textSecondary flex items-center gap-1.5 mt-1">
            <Calendar className="w-3.5 h-3.5 text-accent" />
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)} ({trip.days} Days)
          </p>
        </div>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete trip to ${trip.destination}?`)) onDelete(trip.id);
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-error/15 text-textSecondary hover:text-error transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Style Badges */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
          {trip.travelStyle}
        </span>
        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-primary/10 text-primary-light border border-primary/20">
          {trip.travelType}
        </span>
        {trip.interests.slice(0, 2).map((interest) => (
          <span
            key={interest}
            className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/5 text-textSecondary border border-white/5"
          >
            {interest}
          </span>
        ))}
      </div>

      {/* Budget Summary */}
      <div className="space-y-1.5 mb-5 flex-1">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-textSecondary">Spent of ${totalBudget} budget</span>
          <span className={percentSpent > 90 ? 'text-error font-semibold' : 'text-white'}>
            ${spentBudget} ({percentSpent}%)
          </span>
        </div>
        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${percentSpent}%` }}
          />
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-2 gap-2 mt-auto">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/packing', { state: { tripId: trip.id } })}
          className="gap-1.5 text-[11px] h-9"
        >
          <Briefcase className="w-3.5 h-3.5 text-accent" />
          Packing List
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/finance', { state: { tripId: trip.id } })}
          className="gap-1.5 text-[11px] h-9"
        >
          <Wallet className="w-3.5 h-3.5 text-primary-light" />
          Expenses
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/planner', { state: { activeTripId: trip.id } })}
          className="col-span-2 gap-1.5 text-[11px] h-9 mt-1"
        >
          View Full Itinerary
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
};
export default TripCard;
