import React from 'react';

interface CardProps {
  suit: string;
  rank: string;
  hidden?: boolean;
  className?: string;
}

const Card: React.FC<CardProps> = ({ suit, rank, hidden = false, className = '' }) => {
  const suitSymbols: Record<string, string> = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠',
  };

  const suitColors: Record<string, string> = {
    hearts: 'text-red-600',
    diamonds: 'text-red-600',
    clubs: 'text-black',
    spades: 'text-black',
  };

  // responsive sizing via Tailwind plus enhanced texture classes
  const baseClasses =
    'inline-flex select-none items-center justify-center rounded-lg shadow-md';

  if (hidden) {
    return (
      <div
        aria-hidden
        className={`${baseClasses} card-back w-20 h-28 sm:w-24 sm:h-32 md:w-28 md:h-40 ${className}`}
      >
        <div className="flex flex-col items-center justify-center gap-1">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.06)" />
            <path d="M8 12h8" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 15h8" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`${rank} of ${suit}`}
      className={`${baseClasses} card-surface w-20 h-28 sm:w-24 sm:h-32 md:w-28 md:h-40 ${className}`}
    >
      <div className="flex flex-col items-center justify-between h-full py-1">
        <div className={`text-xs sm:text-sm font-semibold ${suitColors[suit]} flex items-center gap-1`}>
          <span className="leading-none">{rank}</span>
          <span className="leading-none">{suitSymbols[suit]}</span>
        </div>

        <div className={`text-2xl sm:text-3xl md:text-4xl font-extrabold ${suitColors[suit]}`}>
          {suitSymbols[suit]}
        </div>

        <div className={`text-xs sm:text-sm font-semibold ${suitColors[suit]} transform rotate-180`}>
          <div className="leading-none">{rank}</div>
          <div className="leading-none">{suitSymbols[suit]}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;