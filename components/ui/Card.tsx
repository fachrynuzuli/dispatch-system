import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glass?: boolean;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, glass = false, interactive = false }) => {
  const baseClasses = `rounded-2xl border transition-all duration-300 overflow-hidden`;
  
  const styleClasses = glass 
    ? `glass-panel border-white/40 shadow-soft-md` 
    : `bg-white border-slate-100 shadow-soft-sm`;

  // Bento-style interaction: lift up and deepen shadow
  const interactionClasses = (onClick || interactive)
    ? `hover:-translate-y-1 hover:shadow-soft-xl cursor-pointer active:scale-[0.98] active:shadow-soft-sm`
    : `hover:shadow-soft-md`;
  
  return (
    <div 
      className={`${baseClasses} ${styleClasses} ${interactionClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="px-6 py-4 flex justify-between items-start border-b border-slate-50/50">
    <div>
      <h3 className="text-lg font-semibold text-slate-900 tracking-tight">{title}</h3>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);