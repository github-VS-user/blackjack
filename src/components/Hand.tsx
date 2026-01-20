import React from 'react';
import Card from './Card';

interface HandProps {
  cards: Array<{ suit: string; rank: string }>;
  hiddenCount?: number;
  label?: string;
}

const Hand: React.FC<HandProps> = ({ cards, hiddenCount = 0, label }) => {
  const calculateValue = (cardList: Array<{ suit: string; rank: string }>) => {
    let value = 0;
    let aces = 0;

    cardList.forEach((card) => {
      if (card.rank === 'A') {
        aces += 1;
        value += 11;
      } else if (['K', 'Q', 'J'].includes(card.rank)) {
        value += 10;
      } else {
        value += parseInt(card.rank);
      }
    });

    while (value > 21 && aces > 0) {
      value -= 10;
      aces -= 1;
    }

    return value;
  };

  const value = calculateValue(cards);
  const isBust = value > 21;

  return (
    <div className="flex flex-col items-center gap-4">
      {label && <h3 className="text-lg md:text-xl font-semibold text-white/90">{label}</h3>}

      {/* Mobile / small screens: stacked, accessible layout */}
      <div className="cards-stack md:hidden">
        {Array.from({ length: hiddenCount }).map((_, i) => (
          <Card key={`hidden-mobile-${i}`} suit="spades" rank="?" hidden={true} />
        ))}
        {cards.map((card, i) => (
          <Card
            key={`${card.suit}-${card.rank}-${i}`}
            suit={card.suit}
            rank={card.rank}
          />
        ))}
      </div>

      {/* Tablet+ : overlapping card layout for a richer, table-like presentation */}
      <div className="hidden md:flex cards-overlap" aria-hidden={false}>
        {/* hidden cards first */}
        {Array.from({ length: hiddenCount }).map((_, i) => (
          <div key={`hidden-${i}`} className="card-wrapper" style={{ zIndex: i + 1 }}>
            <Card suit="spades" rank="?" hidden={true} />
          </div>
        ))}

        {/* visible cards */}
        {cards.map((card, i) => (
          <div key={`${card.suit}-${card.rank}-${i}`} className="card-wrapper" style={{ zIndex: hiddenCount + i + 2 }}>
            <Card suit={card.suit} rank={card.rank} />
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className={`text-2xl md:text-3xl font-bold ${isBust ? 'text-red-400' : 'text-white/95'}`}>
          {value}
        </p>
        {isBust && <p className="text-red-400 text-sm font-semibold">BUST</p>}
      </div>
    </div>
  );
};

export default Hand;