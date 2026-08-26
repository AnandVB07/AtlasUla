import React from 'react';

// ==========================================
// CARD COMPONENT
// ==========================================
interface CardProps {
  children: React.ReactNode;
  variant?: 'glass' | 'solid' | 'glow';
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, variant = 'solid', className = '' }) => {
  const baseStyle = 'rounded-2xl transition-all duration-300';
  
  const variantStyles = {
    solid: 'bg-card border border-white/5 shadow-glass-sm',
    glass: 'glass-card',
    glow: 'bg-card border border-primary/20 glow-primary shadow-glass',
  };

  return (
    <div className={`${baseStyle} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
};

// ==========================================
// BUTTON COMPONENT
// ==========================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center rounded-xl font-poppins font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantStyles = {
    primary: 'bg-primary hover:bg-primary-dark border border-primary/30 text-white shadow-glass-sm hover:shadow-glass hover:shadow-primary/25',
    accent: 'bg-accent hover:bg-accent-dark border border-accent/30 text-background hover:shadow-glass hover:shadow-accent/25',
    outline: 'bg-transparent border border-white/15 hover:border-white/30 text-white hover:bg-white/5',
    glass: 'bg-white/5 hover:bg-white/10 border border-white/10 text-white backdrop-blur-md',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// ==========================================
// INPUT COMPONENT
// ==========================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider font-sora">
          {label}
        </label>
      )}
      <input
        className={`w-full glass-input rounded-xl px-4 py-3 text-sm font-medium focus:outline-none ${className}`}
        {...props}
      />
      {error && <p className="text-[10px] text-error font-medium">{error}</p>}
    </div>
  );
};
