import {
Award,
Briefcase,
Calendar,
CheckCircle,
Compass,
DollarSign,
Flame,
Globe,
LogOut,
Map,
MapPin,
User,
Utensils,
Zap
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button,Card } from '../components/UI';
import { useAuth } from '../context/AuthContext';

export const Profile: React.FC = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <span className="text-xs text-textSecondary uppercase font-bold tracking-widest animate-pulse">Syncing profile...</span>
      </div>
    );
  }

  // Helper to map badge icons dynamically
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass': return <Compass className="w-6 h-6 text-primary-light" />;
      case 'DollarSign': return <DollarSign className="w-6 h-6 text-accent" />;
      case 'Briefcase': return <Briefcase className="w-6 h-6 text-warning" />;
      case 'Utensils': return <Utensils className="w-6 h-6 text-success" />;
      case 'Zap': return <Zap className="w-6 h-6 text-primary-light" />;
      case 'User': return <User className="w-6 h-6 text-accent" />;
      case 'Calendar': return <Calendar className="w-6 h-6 text-warning" />;
      case 'Flame': return <Flame className="w-6 h-6 text-error" />;
      default: return <Award className="w-6 h-6 text-textSecondary" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 select-none">
      {/* Profile Header Block */}
      <Card variant="glass" className="p-8 border-white/10 relative overflow-hidden bg-gradient-to-br from-card/80 to-primary/5">
        <div className="absolute top-0 right-0 w-44 h-44 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 overflow-hidden shrink-0 relative flex items-center justify-center p-2">
              <img 
                src={profile.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${profile.uid}`} 
                alt="Avatar" 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Profile Info */}
            <div className="text-center md:text-left space-y-1">
              <span className="text-[9px] font-bold text-accent uppercase tracking-widest font-sora">Travel Level Status</span>
              <h1 className="text-2xl font-black text-white font-sora tracking-tight">{profile.displayName || 'Explorer'}</h1>
              <p className="text-xs text-textSecondary">{profile.email}</p>
            </div>
          </div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="gap-1.5 text-xs border-error/20 hover:bg-error/10 hover:border-error/30 text-error shrink-0 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </Button>
        </div>
      </Card>

      {/* Statistics counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="solid" className="p-5 bg-card/60 border-white/5 text-center">
          <Globe className="w-6 h-6 text-primary-light mx-auto mb-2" />
          <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider">Countries Visited</span>
          <h3 className="text-2xl font-black text-white font-sora mt-1">{profile.countriesVisited.length || 0}</h3>
        </Card>

        <Card variant="solid" className="p-5 bg-card/60 border-white/5 text-center">
          <MapPin className="w-6 h-6 text-accent mx-auto mb-2" />
          <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider">Cities Explored</span>
          <h3 className="text-2xl font-black text-white font-sora mt-1">{profile.citiesVisited.length || 0}</h3>
        </Card>

        <Card variant="solid" className="p-5 bg-card/60 border-white/5 text-center">
          <Map className="w-6 h-6 text-success mx-auto mb-2" />
          <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider">Trips Completed</span>
          <h3 className="text-2xl font-black text-white font-sora mt-1">{profile.tripsCompleted || 0}</h3>
        </Card>

        <Card variant="solid" className="p-5 bg-card/60 border-white/5 text-center">
          <Flame className="w-6 h-6 text-warning mx-auto mb-2" />
          <span className="text-[10px] text-textSecondary uppercase font-bold tracking-wider">Active Streak</span>
          <h3 className="text-2xl font-black text-white font-sora mt-1">{profile.streak || 1} Days</h3>
        </Card>
      </div>

      {/* Badges Achievements */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white font-sora flex items-center gap-2">
          <Award className="w-5 h-5 text-accent animate-pulse-glow" /> Earned Badges & Achievements
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.achievements.map((ach) => (
            <Card 
              key={ach.id} 
              variant="solid" 
              className={`p-4 bg-card/65 border-white/5 flex gap-4 items-center transition-all duration-300 ${
                ach.unlocked ? 'border-primary/20 bg-gradient-to-tr from-card to-primary/5' : 'opacity-60'
              }`}
            >
              {/* Badge Icon wrapper */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${
                ach.unlocked 
                  ? 'bg-primary/20 border-primary/40 glow-primary' 
                  : 'bg-white/5 border-white/10 text-textSecondary/40'
              }`}>
                {getBadgeIcon(ach.icon)}
              </div>

              {/* Progress Detail */}
              <div className="flex-grow space-y-1">
                <div className="flex justify-between items-start gap-4">
                  <h4 className="text-xs font-bold text-white leading-normal">{ach.title}</h4>
                  {ach.unlocked && <span className="text-[9px] font-bold text-success flex items-center gap-0.5"><CheckCircle className="w-3 h-3" /> Unlocked</span>}
                </div>
                <p className="text-[10px] text-textSecondary leading-normal">{ach.description}</p>
                
                {/* Progress bar (if not unlocked) */}
                {!ach.unlocked && ach.maxProgress > 1 && (
                  <div className="space-y-1 pt-1.5">
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-accent h-full rounded-full" 
                        style={{ width: `${Math.round((ach.progress / ach.maxProgress) * 100)}%` }}
                      />
                    </div>
                    <div className="text-right text-[8px] text-textSecondary font-semibold">
                      {ach.progress} / {ach.maxProgress} completed
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
