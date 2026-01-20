import React, { useState, useEffect } from 'react';
import Hand from '../components/Hand';
import GameControls from '../components/GameControls';
import GameStatus from '../components/GameStatus';

interface Card {
  suit: string;
  rank: string;
}

// Renamed type to avoid collision with the GameStatus component import
type GamePhase = 'playing' | 'playerWin' | 'dealerWin' | 'tie';

const BALANCE_KEY = 'blackjack_balance_v1';
const DEBT_KEY = 'blackjack_debt_v1';

const Home: React.FC = () => {
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [dealerHiddenCard, setDealerHiddenCard] = useState<Card | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState<GamePhase>('playing');
  const [statusMessage, setStatusMessage] = useState('');
  const [playerWins, setPlayerWins] = useState(0);
  const [dealerWins, setDealerWins] = useState(0);
  const [ties, setTies] = useState(0);

  // Wallet & betting
  const [balance, setBalance] = useState<number>(1000);
  const [debt, setDebt] = useState<number>(0);
  const [bet, setBet] = useState<number>(50);
  const [lockedBet, setLockedBet] = useState<number | null>(null); // bet locked for current round

  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  // Load persisted balance/debt on mount
  useEffect(() => {
    const storedBalance = localStorage.getItem(BALANCE_KEY);
    const storedDebt = localStorage.getItem(DEBT_KEY);
    if (storedBalance !== null) setBalance(Number(storedBalance));
    if (storedDebt !== null) setDebt(Number(storedDebt));
    // start a round on mount using the current bet if affordable
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist balance/debt
  useEffect(() => {
    localStorage.setItem(BALANCE_KEY, String(balance));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem(DEBT_KEY, String(debt));
  }, [debt]);

  const getRandomCard = (): Card => {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    return { suit, rank };
  };

  const calculateHandValue = (hand: Card[]): number => {
    let value = 0;
    let aces = 0;

    hand.forEach((card) => {
      if (card.rank === 'A') {
        aces += 1;
        value += 11;
      } else if (['K', 'Q', 'J'].includes(card.rank)) {
        value += 10;
      } else {
        value += parseInt(card.rank, 10);
      }
    });

    while (value > 21 && aces > 0) {
      value -= 10;
      aces -= 1;
    }

    return value;
  };

  const startNewGame = () => {
    // disallow starting a new round if there is already a locked bet (safety)
    if (lockedBet !== null) {
      setStatusMessage('Round already in progress');
      return;
    }

    if (bet <= 0) {
      setStatusMessage('Set a bet greater than 0');
      return;
    }

    if (balance < bet) {
      setStatusMessage('Insufficient funds. Borrow or lower your bet.');
      return;
    }

    // Lock the bet by removing it from balance for the round
    setBalance((prev) => prev - bet);
    setLockedBet(bet);

    const newPlayerHand = [getRandomCard(), getRandomCard()];
    const newDealerHand = [getRandomCard()];
    const newDealerHiddenCard = getRandomCard();

    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setDealerHiddenCard(newDealerHiddenCard);
    setGameOver(false);
    setGameStatus('playing');
    setStatusMessage('Your turn');

    const playerValue = calculateHandValue(newPlayerHand);
    // immediate blackjack: payout 3:2 (1.5x) plus original bet -> total 2.5x bet
    if (playerValue === 21) {
      const payout = Math.round(bet * 2.5); // total returned to player
      setBalance((prev) => prev + payout);
      setGameStatus('playerWin');
      setStatusMessage('Blackjack! You win!');
      setGameOver(true);
      setPlayerWins((prev) => prev + 1);
      setLockedBet(null);
    }
  };

  const handleHit = () => {
    if (gameOver || lockedBet === null) return;
    const newCard = getRandomCard();
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);

    const value = calculateHandValue(newHand);
    if (value > 21) {
      // player busts, lockedBet is lost (already subtracted from balance)
      setGameStatus('dealerWin');
      setStatusMessage('Bust! Dealer wins!');
      setGameOver(true);
      setDealerWins((prev) => prev + 1);
      setLockedBet(null);
    }
  };

  const handleStand = () => {
    if (dealerHiddenCard && lockedBet !== null) {
      const fullDealerHand = [...dealerHand, dealerHiddenCard];
      let dealerFullHand = fullDealerHand;

      while (calculateHandValue(dealerFullHand) < 17) {
        dealerFullHand = [...dealerFullHand, getRandomCard()];
      }

      const playerValue = calculateHandValue(playerHand);
      const dealerValue = calculateHandValue(dealerFullHand);

      setDealerHand(dealerFullHand);
      setDealerHiddenCard(null);

      if (dealerValue > 21) {
        // dealer busts -> player wins, pays 1:1 (player gets back bet + winnings)
        const payout = lockedBet * 2;
        setBalance((prev) => prev + payout);
        setGameStatus('playerWin');
        setStatusMessage('Dealer bust! You win!');
        setPlayerWins((prev) => prev + 1);
      } else if (playerValue > dealerValue) {
        const payout = lockedBet * 2;
        setBalance((prev) => prev + payout);
        setGameStatus('playerWin');
        setStatusMessage('You win!');
        setPlayerWins((prev) => prev + 1);
      } else if (dealerValue > playerValue) {
        // player loses, locked bet already removed
        setGameStatus('dealerWin');
        setStatusMessage('Dealer wins!');
        setDealerWins((prev) => prev + 1);
      } else {
        // tie/push -> return bet
        setBalance((prev) => prev + lockedBet);
        setGameStatus('tie');
        setStatusMessage("It's a tie!");
        setTies((prev) => prev + 1);
      }

      setGameOver(true);
      setLockedBet(null);
    }
  };

  // Borrow (rent) money: apply a simple 10% fee that is added to debt immediately
  const borrowMoney = (amount: number) => {
    if (amount <= 0) return;
    const feeRate = 0.10;
    const debtIncrease = Math.round(amount * (1 + feeRate));
    setBalance((prev) => prev + amount);
    setDebt((prev) => prev + debtIncrease);
    setStatusMessage(`Borrowed ${amount} chips (fee applied: ${Math.round(amount * feeRate)}).`);
  };

  // Repay debt using available balance; repay either specified amount or as much as possible
  const repayDebt = (amount?: number) => {
    if (debt <= 0) {
      setStatusMessage('No outstanding debt to repay.');
      return;
    }

    const repayAmount = amount ? Math.min(amount, balance, debt) : Math.min(balance, debt);
    if (repayAmount <= 0) {
      setStatusMessage('Insufficient balance to repay.');
      return;
    }

    setBalance((prev) => prev - repayAmount);
    setDebt((prev) => Math.max(0, prev - repayAmount));
    setStatusMessage(`Repaid ${repayAmount} chips of debt.`);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Blackjack</h1>
          <p className="text-green-100">Beat the dealer to win!</p>
        </header>

        <GameStatus
          status={gameStatus}
          message={statusMessage}
          playerWins={playerWins}
          dealerWins={dealerWins}
          ties={ties}
          balance={balance}
          debt={debt}
        />

        <div className="bg-gradient-to-b from-green-800 to-green-900 rounded-lg shadow-2xl p-6 md:p-10 felt-bg ipad-scale">
          <div className="mb-8">
            <Hand
              cards={dealerHand}
              hiddenCount={dealerHiddenCard ? 1 : 0}
              label="Dealer"
            />
          </div>

          <div className="border-t-2 border-green-700 my-8 opacity-60"></div>

          <div className="mb-6">
            <Hand cards={playerHand} label="Your Hand" />
          </div>
        </div>

        <GameControls
          onHit={handleHit}
          onStand={handleStand}
          onNewGame={startNewGame}
          canHit={!gameOver}
          canStand={!gameOver}
          gameOver={gameOver}
          balance={balance}
          debt={debt}
          bet={bet}
          setBet={setBet}
          borrowMoney={borrowMoney}
          repayDebt={repayDebt}
          lockedBet={lockedBet}
        />
      </div>
    </div>
  );
};

export default Home;