import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glass?: boolean;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, glass = false, interactive = false }) => {
  const baseClasses = `rounded-2xl border border-slate-200 transition-all duration-300 overflow-hidden`;
  
  const styleClasses = glass 
    ? `bg-white/80 backdrop-blur-xl` 
    : `bg-white`;

  const interactionClasses = (onClick || interactive)
    ? `hover:-translate-y-1 hover:shadow-soft-xl cursor-pointer active:translate-y-0 active:shadow-soft-sm shadow-soft-md`
    : `shadow-soft-sm`;
  
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
  <div className="px-6 py-5 flex justify-between items-start border-b border-slate-200 bg-white">
    <div>
      <h3 className="text-lg font-display font-semibold text-slate-900 tracking-tight">{title}</h3>
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