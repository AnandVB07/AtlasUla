import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Button } from '../components/UI';
import { AchievementCard } from '../components/AchievementCard';
import { 
  Award, 
  MapPin, 
  Globe, 
  Flame, 
  Compass, 
  CheckCircle,
  FileText,
  User
} from 'lucide-react';
import { Trip, UserAchievement } from '../types';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  
  const [completedTrips, setCompletedTrips] = useState<Trip[]>([]);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem('atlasula_trips');
      if (stored) {
        try {
          const trips: Trip[] = JSON.parse(stored);
          setCompletedTrips(trips);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [user]);

  if (!profile) return null;

  // Unlocked vs locked count
  const unlockedCount = profile.achievements.filter(a => a.unlocked).length;
  const totalCount = profile.achievements.length;
  const percentAchievements = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Profile Cover card */}
      <Card variant="glass" className="p-6 md:p-8 border-white/10 bg-gradient-to-br from-card/85 to-primary/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl border-2 border-primary overflow-hidden shrink-0 bg-white/5 shadow-lg">
            <img 
              src={profile.photoURL || 'https://api.dicebear.com/7.x/adventurer/svg?seed=explorer'} 
              alt={profile.displayName || 'User'}
              className="w-full h-full object-cover"
            />
          </div>

          {/* User Meta */}
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold text-white font-sora">{profile.displayName}</h1>
            <p className="text-xs text-textSecondary">{profile.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
              <span className="text-[10px] font-bold bg-primary/20 text-primary-light border border-primary/30 px-3 py-1 rounded-full uppercase tracking-wider font-sora">
                Rank: {profile.travelLevel}
              </span>
              <span className="text-[10px] font-bold bg-white/5 border border-white/10 text-textSecondary px-3 py-1 rounded-full">
                {profile.xp} XP total
              </span>
            </div>
          </div>

          {/* Quick Edit settings button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/settings')}
            className="cursor-pointer shrink-0"
          >
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* Stats Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="solid" className="p-4 bg-card/65 border-white/5 text-center space-y-1">
          <Globe className="w-5 h-5 text-accent mx-auto" />
          <p className="text-[10px] text-textSecondary font-semibold uppercase tracking-wider">Countries</p>
          <p className="text-xl font-black text-white">{profile.countriesVisited.length || 0}</p>
        </Card>

        <Card variant="solid" className="p-4 bg-card/65 border-white/5 text-center space-y-1">
          <MapPin className="w-5 h-5 text-primary-light mx-auto" />
          <p className="text-[10px] text-textSecondary font-semibold uppercase tracking-wider">Cities</p>
          <p className="text-xl font-black text-white">{profile.citiesVisited.length || 0}</p>
        </Card>

        <Card variant="solid" className="p-4 bg-card/65 border-white/5 text-center space-y-1">
          <Compass className="w-5 h-5 text-success mx-auto" />
          <p className="text-[10px] text-textSecondary font-semibold uppercase tracking-wider">Completed Trips</p>
          <p className="text-xl font-black text-white">{profile.tripsCompleted || 0}</p>
        </Card>

        <Card variant="solid" className="p-4 bg-card/65 border-white/5 text-center space-y-1">
          <Flame className="w-5 h-5 text-warning mx-auto animate-pulse" />
          <p className="text-[10px] text-textSecondary font-semibold uppercase tracking-wider">Streak Days</p>
          <p className="text-xl font-black text-warning">{profile.streak || 0}</p>
        </Card>
      </div>

      {/* Main Grid Layout: Badges vs Travels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Achievements Badge Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-lg font-bold text-white font-sora flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" /> Travel Badges
            </h2>
            <span className="text-xs text-textSecondary font-medium">
              {unlockedCount}/{totalCount} unlocked ({percentAchievements}%)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.achievements.map((ach) => (
              <AchievementCard key={ach.id} achievement={ach} />
            ))}
          </div>
        </div>

        {/* Trips Completed list */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-lg font-bold text-white font-sora">Travel Logbooks</h2>
          
          <Card variant="solid" className="p-5 bg-card/65 border-white/5 space-y-4">
            {completedTrips.length > 0 ? (
              <div className="space-y-3">
                {completedTrips.map((trip) => (
                  <div 
                    key={trip.id}
                    className="p-3 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">{trip.destination}</h4>
                      <p className="text-[9px] text-textSecondary mt-0.5">{trip.days} Days • {trip.travelStyle}</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-xs text-textSecondary p-6">
                No saved logs found. Create your first itinerary in the Trip Planner to sync logs here!
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
