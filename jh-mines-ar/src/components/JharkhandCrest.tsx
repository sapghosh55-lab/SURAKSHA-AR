import React from 'react';

interface CrestProps {
  className?: string;
  size?: number;
}

export const JharkhandCrest: React.FC<CrestProps> = ({ className = '', size = 42 }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circular Ring */}
        <circle cx="50" cy="50" r="48" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="43" fill="#1e293b" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 2" />

        {/* Outer Green Ring segment for Jharkhand Forest representation */}
        <circle cx="50" cy="50" r="39" stroke="#16a34a" strokeWidth="3" fill="none" opacity="0.85" />

        {/* Inner Gold Shield / Crest Base */}
        <path
          d="M 50 16 L 76 26 C 76 56 64 74 50 84 C 36 74 24 56 24 26 Z"
          fill="url(#goldGradient)"
          stroke="#f59e0b"
          strokeWidth="1.5"
        />

        {/* Ashoka Chakra / Central Sun Motif */}
        <circle cx="50" cy="46" r="14" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
        
        {/* Sun/Chakra Rays */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 50 + 9 * Math.cos(angle);
          const y1 = 46 + 9 * Math.sin(angle);
          const x2 = 50 + 13 * Math.cos(angle);
          const y2 = 46 + 13 * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#f59e0b"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          );
        })}

        {/* Elephant Symbol Silhouette (Jharkhand State Animal Motif) */}
        <path
          d="M 44 48 C 45 44 50 43 55 45 C 57 46 58 48 57 50 C 56 52 53 53 50 53 C 47 53 45 51 44 48 Z"
          fill="#f59e0b"
        />

        {/* Palash Flower / Laurel Leaf Accents */}
        <path d="M 30 66 C 36 68 44 72 50 78 C 56 72 64 68 70 66" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Star Accents */}
        <polygon points="50,20 52,24 56,24 53,27 54,31 50,28 46,31 47,27 44,24 48,24" fill="#fbbf24" />

        <defs>
          <linearGradient id="goldGradient" x1="24" y1="16" x2="76" y2="84" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
