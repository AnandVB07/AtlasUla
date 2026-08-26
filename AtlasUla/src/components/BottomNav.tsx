import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Compass, 
  Wallet, 
  BookOpen, 
  User 
} from 'lucide-react';

const mobileNavItems = [
  { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { path: '/planner', label: 'Planner', icon: Compass },
  { path: '/finance', label: 'Finance', icon: Wallet },
  { path: '/journal', label: 'Journal', icon: BookOpen },
  { path: '/profile', label: 'Profile', icon: User },
];

export const BottomNav: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/85 backdrop-blur-lg border-t border-white/5 flex items-center justify-around px-2 pb-safe z-30 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
      {mobileNavItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-primary scale-105'
                  : 'text-textSecondary hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
export default BottomNav;
