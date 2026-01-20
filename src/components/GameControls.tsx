import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

interface GameControlsProps {
  onHit: () => void;
  onStand: () => void;
  onNewGame: () => void;
  canHit: boolean;
  canStand: boolean;
  gameOver: boolean;
  balance: number;
  debt: number;
  bet: number;
  setBet: (v: number) => void;
  borrowMoney: (amount: number) => void;
  repayDebt: (amount?: number) => void;
  lockedBet: number | null;
}

const GameControls: React.FC<GameControlsProps> = ({
  onHit,
  onStand,
  onNewGame,
  canHit,
  canStand,
  gameOver,
  balance,
  debt,
  bet,
  setBet,
  borrowMoney,
  repayDebt,
  lockedBet,
}) => {
  const [borrowAmount, setBorrowAmount] = useState<number>(100);
  const [repayAmount, setRepayAmount] = useState<number | undefined>(undefined);

  const format = (n: number) => n.toLocaleString();

  return (
    <div className="mt-6">
      <div className="bg-white/5 rounded-lg p-4 mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-sm text-white/70">Balance</span>
          <span className="text-2xl font-bold text-emerald-300">{format(balance)} chips</span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-white/70">Debt</span>
          <span className={`text-2xl font-bold ${debt > 0 ? 'text-rose-300' : 'text-white/60'}`}>{format(debt)} chips</span>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-white/70">Bet</label>
          <input
            type="number"
            min={1}
            value={bet}
            onChange={(e) => setBet(Math.max(1, Math.floor(Number(e.target.value) || 0)))}
            className="w-24 px-3 py-2 rounded-md bg-white/90 text-black font-semibold"
            aria-label="Bet amount"
          />
          <span className="text-sm text-white/70">locked: {lockedBet ?? 0}</span>
        </div>
      </div>

      <div className="flex gap-4 justify-center flex-wrap controls-touch-friendly">
        {!gameOver ? (
          <>
            <button
              onClick={onHit}
              disabled={!canHit}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white font-bold rounded-lg shadow-lg transition transform active:translate-y-0.5"
              aria-label="Hit"
            >
              Hit
            </button>
            <button
              onClick={onStand}
              disabled={!canStand}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-400 text-white font-bold rounded-lg shadow-lg transition transform active:translate-y-0.5"
              aria-label="Stand"
            >
              Stand
            </button>
            <button
              onClick={onNewGame}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xl transition transform flex items-center gap-3"
              aria-label="New Game"
            >
              <RotateCcw size={18} />
              <span>New Round</span>
            </button>
          </>
        ) : (
          <button
            onClick={onNewGame}
            className="px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xl transition transform flex items-center gap-3"
            aria-label="New Game"
          >
            <RotateCcw size={18} />
            <span>New Game</span>
          </button>
        )}
      </div>

      <div className="mt-4 bg-white/5 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-white/70">Borrow (rent) chips</label>
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(Math.max(1, Math.floor(Number(e.target.value) || 0)))}
              className="w-full px-3 py-2 rounded-md bg-white/90 text-black font-semibold"
              aria-label="Borrow amount"
            />
            <button
              onClick={() => borrowMoney(borrowAmount)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-md"
            >
              Borrow
            </button>
          </div>
          <p className="text-xs text-white/60">Borrowing applies a 10% fee added to your debt immediately.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-white/70">Repay debt</label>
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              placeholder="auto (use all available)"
              value={repayAmount ?? ''}
              onChange={(e) => {
                const v = e.target.value === '' ? undefined : Math.max(1, Math.floor(Number(e.target.value) || 0));
                setRepayAmount(v);
              }}
              className="w-full px-3 py-2 rounded-md bg-white/90 text-black font-semibold"
              aria-label="Repay amount"
            />
            <button
              onClick={() => repayDebt(repayAmount)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md"
            >
              Repay
            </button>
          </div>
          <p className="text-xs text-white/60">You can repay partially or leave blank to repay as much as possible.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-white/70">Quick actions</label>
          <div className="flex gap-2">
            <button
              onClick={() => borrowMoney(100)}
              className="px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md font-semibold"
            >
              +100
            </button>
            <button
              onClick={() => borrowMoney(500)}
              className="px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md font-semibold"
            >
              +500
            </button>
            <button
              onClick={() => repayDebt()}
              className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md font-semibold"
            >
              Repay All Possible
            </button>
          </div>
          <p className="text-xs text-white/60">Quick borrow/repay shortcuts.</p>
        </div>
      </div>
    </div>
  );
};

export default GameControls;