import React from 'react';
import { X } from 'lucide-react';

// ==========================================
// BUTTON COMPONENT
// ==========================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'glass' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary-light text-white shadow-lg shadow-primary/20 hover:scale-[1.02]',
    secondary: 'bg-white/10 hover:bg-white/15 text-white border border-white/5',
    accent: 'bg-accent hover:bg-accent-light text-background font-bold shadow-lg shadow-accent/20 hover:scale-[1.02]',
    outline: 'bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/40',
    glass: 'bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 shadow-glass-sm',
    danger: 'bg-error hover:bg-red-500 text-white shadow-lg shadow-error/20'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// ==========================================
// CARD COMPONENT
// ==========================================
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'solid' | 'glass' | 'glow';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl p-5 border transition-all duration-300';
  
  const variants = {
    solid: 'bg-card border-white/5 shadow-xl',
    glass: 'glass-card',
    glow: 'glass-card hover:border-primary/45 border-white/10 shadow-lg hover:shadow-primary/5'
  };

  const hoverStyle = hoverEffect ? 'hover:-translate-y-1 hover:shadow-2xl' : '';

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// ==========================================
// INPUT COMPONENT
// ==========================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', type = 'text', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider font-sora">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={`w-full rounded-xl px-4 py-3 text-sm glass-input font-medium focus:outline-none ${
            error ? 'border-error focus:border-error focus:ring-1 focus:ring-error' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-error font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-textSecondary">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ==========================================
// MODAL COMPONENT
// ==========================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Content Panel */}
      <div className="w-full max-w-lg glass-card rounded-2xl overflow-hidden shadow-2xl relative z-10 border border-white/10 transform transition-all animate-float">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-primary/10 to-transparent">
          {title && <h3 className="font-semibold text-lg text-white font-sora">{title}</h3>}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-textSecondary hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
