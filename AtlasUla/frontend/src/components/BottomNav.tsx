import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Compass, 
  Wallet, 
  Briefcase, 
  BookOpen 
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dash', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/planner', label: 'Plan', icon: <Compass className="w-5 h-5" /> },
    { to: '/finance', label: 'Spend', icon: <Wallet className="w-5 h-5" /> },
    { to: '/packing', label: 'Pack', icon: <Briefcase className="w-5 h-5" /> },
    { to: '/journal', label: 'Logs', icon: <BookOpen className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/90 backdrop-blur-md border-t border-white/5 flex items-center justify-around z-30 lg:hidden px-4 select-none">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `
            flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-300
            ${isActive 
              ? 'text-primary' 
              : 'text-textSecondary hover:text-white'}
          `}
        >
          {item.icon}
          <span className="text-[9px] font-bold mt-1 tracking-wider">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
