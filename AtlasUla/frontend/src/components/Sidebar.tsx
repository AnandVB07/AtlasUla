import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Plane, 
  LayoutDashboard, 
  Compass, 
  Wallet, 
  Bed, 
  Utensils, 
  Briefcase, 
  CloudSun, 
  BookOpen, 
  ShieldCheck, 
  User, 
  Settings 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/planner', label: 'AI Itinerary', icon: <Compass className="w-4 h-4" /> },
    { to: '/finance', label: 'Finance & Expense', icon: <Wallet className="w-4 h-4" /> },
    { to: '/hotels', label: 'Hotel Booking', icon: <Bed className="w-4 h-4" /> },
    { to: '/restaurants', label: 'Food & Dining', icon: <Utensils className="w-4 h-4" /> },
    { to: '/packing', label: 'Packing Checklists', icon: <Briefcase className="w-4 h-4" /> },
    { to: '/weather', label: 'Weather Outlook', icon: <CloudSun className="w-4 h-4" /> },
    { to: '/journal', label: 'Scrapbook Journal', icon: <BookOpen className="w-4 h-4" /> },
    { to: '/safety', label: 'Safety Center', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <aside className="hidden lg:flex lg:w-64 glass-panel flex-col justify-between fixed top-0 bottom-0 left-0 p-5 z-30 select-none">
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 px-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center glow-primary">
            <Plane className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-sora font-black text-base tracking-tight text-white">AtlasUla</span>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300
                ${isActive 
                  ? 'bg-primary text-white border border-primary/25 glow-primary' 
                  : 'text-textSecondary hover:bg-white/5 border border-transparent hover:text-white'}
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User profile section at the bottom */}
      {profile && (
        <div className="border-t border-white/5 pt-4 space-y-3.5">
          <div 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 px-2 py-1 rounded-xl hover:bg-white/5 transition-all cursor-pointer group"
          >
            {/* Avatar thumbnail */}
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 overflow-hidden relative flex items-center justify-center p-1.5 shrink-0">
              <img 
                src={profile.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${profile.uid}`} 
                alt="Avatar" 
                className="w-full h-full object-contain"
              />
            </div>
            {/* Name/level */}
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white truncate group-hover:text-primary-light transition-colors leading-normal">{profile.displayName || 'Explorer'}</h4>
              <p className="text-[9px] text-textSecondary uppercase tracking-wider font-semibold truncate leading-none mt-0.5">{profile.travelLevel}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 px-1">
            <NavLink 
              to="/profile"
              className={({ isActive }) => `
                flex items-center justify-center gap-1.5 py-1.5 rounded-lg border text-[10px] font-semibold transition-all
                ${isActive ? 'bg-white/10 border-white/10 text-white' : 'border-white/5 text-textSecondary hover:bg-white/5 hover:text-white'}
              `}
            >
              <User className="w-3.5 h-3.5" /> Profile
            </NavLink>
            <NavLink 
              to="/settings"
              className={({ isActive }) => `
                flex items-center justify-center gap-1.5 py-1.5 rounded-lg border text-[10px] font-semibold transition-all
                ${isActive ? 'bg-white/10 border-white/10 text-white' : 'border-white/5 text-textSecondary hover:bg-white/5 hover:text-white'}
              `}
            >
              <Settings className="w-3.5 h-3.5" /> Settings
            </NavLink>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
