import React from 'react';

interface GameStatusProps {
  status: string;
  message: string;
  playerWins: number;
  dealerWins: number;
  ties: number;
  balance?: number;
  debt?: number;
}

const GameStatus: React.FC<GameStatusProps> = ({
  status,
  message,
  playerWins,
  dealerWins,
  ties,
  balance = 0,
  debt = 0,
}) => {
  const statusColors: Record<string, string> = {
    playing: 'text-blue-600',
    playerWin: 'text-green-600',
    dealerWin: 'text-red-600',
    tie: 'text-yellow-600',
  };

  const format = (n: number) => n.toLocaleString();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-left">
          <p className={`text-2xl font-bold ${statusColors[status] || 'text-gray-800'}`}>
            {message || (status === 'playing' ? 'Place your bet and play' : '')}
          </p>
          <p className="text-sm text-gray-500 mt-1">Status: <span className="font-medium text-gray-700">{status}</span></p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-600">Balance</p>
          <p className="text-2xl font-bold text-emerald-600">{format(balance)} chips</p>
          <p className="text-sm text-gray-600 mt-2">Debt</p>
          <p className={`text-lg font-bold ${debt > 0 ? 'text-rose-600' : 'text-gray-600'}`}>{format(debt)} chips</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-gray-600 text-sm">Player Wins</p>
          <p className="text-2xl font-bold text-green-600">{playerWins}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Ties</p>
          <p className="text-2xl font-bold text-yellow-600">{ties}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Dealer Wins</p>
          <p className="text-2xl font-bold text-red-600">{dealerWins}</p>
        </div>
      </div>
    </div>
  );
};

export default GameStatus;