import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Compass, 
  Wallet, 
  Bed, 
  Utensils, 
  Briefcase, 
  BookOpen, 
  ShieldCheck, 
  CloudSun, 
  User, 
  Settings, 
  LogOut,
  Flame
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/planner', label: 'AI Planner', icon: Compass },
  { path: '/finance', label: 'Finance & Budget', icon: Wallet },
  { path: '/hotels', label: 'Hotels', icon: Bed },
  { path: '/restaurants', label: 'Restaurants', icon: Utensils },
  { path: '/packing', label: 'Packing list', icon: Briefcase },
  { path: '/journal', label: 'Travel Journal', icon: BookOpen },
  { path: '/weather', label: 'Weather Info', icon: CloudSun },
  { path: '/safety', label: 'Safety Center', icon: ShieldCheck },
  { path: '/profile', label: 'My Profile', icon: User },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 glass-panel bg-card/40 z-30">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-white/5 cursor-pointer" onClick={() => navigate('/dashboard')}>
        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-sora tracking-wide">
          AtlasUla
        </span>
        <span className="px-2 py-0.5 text-[10px] font-semibold bg-primary/20 text-primary-light border border-primary/30 rounded-full">
          MVP
        </span>
      </div>

      {/* Streak Banner */}
      {profile && (
        <div className="px-6 py-3 flex items-center justify-between border-b border-white/5 bg-primary/5">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-warning animate-pulse" />
            <span className="text-sm font-medium">Travel Streak</span>
          </div>
          <span className="text-sm font-bold text-warning">{profile.streak} days</span>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 font-semibold'
                    : 'text-textSecondary hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Section / Footer */}
      {profile && (
        <div className="p-4 border-t border-white/5 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <img
              src={profile.photoURL || 'https://api.dicebear.com/7.x/adventurer/svg?seed=explorer'}
              alt={profile.displayName || 'User'}
              className="w-10 h-10 rounded-xl border border-white/10"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{profile.displayName}</p>
              <p className="text-xs text-textSecondary truncate">{profile.travelLevel}</p>
            </div>
          </div>

          <button
            onClick={() => logout().then(() => navigate('/'))}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </aside>
  );
};
export default Sidebar;
