import React from 'react';

export const AILoadingSparkle = () => {
  return (
    <div className="absolute -inset-1 pointer-events-none z-10 overflow-hidden rounded-xl">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <linearGradient id="ai-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0" />
            <stop offset="50%" stopColor="#c084fc" stopOpacity="1" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Animated border line */}
        <rect 
          x="2" y="2" 
          width="calc(100% - 4px)" height="calc(100% - 4px)" 
          rx="12" ry="12"
          fill="none" 
          stroke="url(#ai-gradient)" 
          strokeWidth="4"
          pathLength="100"
          strokeDasharray="20 80"
          strokeDashoffset="0"
          filter="url(#glow)"
          className="animate-[dash_1.5s_linear_infinite]"
        />
        
        {/* Sparkles */}
        <g className="animate-pulse origin-center" style={{ transformOrigin: '50% 50%', animationDuration: '1s' }}>
          <path d="M 50 10 Q 50 40 80 50 Q 50 60 50 90 Q 50 60 20 50 Q 50 40 50 10" fill="#c084fc" className="opacity-70" transform="scale(0.15) translate(50, 50)"/>
        </g>
        <g className="animate-pulse origin-center" style={{ transformOrigin: '50% 50%', animationDuration: '1.5s', animationDelay: '0.2s' }}>
          <path d="M 50 10 Q 50 40 80 50 Q 50 60 50 90 Q 50 60 20 50 Q 50 40 50 10" fill="#38bdf8" className="opacity-70" transform="scale(0.1) translate(700, 150)"/>
        </g>
        <g className="animate-pulse origin-center" style={{ transformOrigin: '50% 50%', animationDuration: '1.2s', animationDelay: '0.5s' }}>
          <path d="M 50 10 Q 50 40 80 50 Q 50 60 50 90 Q 50 60 20 50 Q 50 40 50 10" fill="#818cf8" className="opacity-70" transform="scale(0.12) translate(200, 300)"/>
        </g>
      </svg>
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
      `}</style>
    </div>
  );
};
