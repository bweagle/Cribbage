import { useState } from 'react';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/game/Card.jsx';
import { Hand } from '../components/game/Hand.jsx';
import { PlayArea } from '../components/game/PlayArea.jsx';
import { PegBoard } from '../components/game/PegBoard.jsx';

export function GameView({ connection, role, onBack }) {
  const [selectedCards, setSelectedCards] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  // Sample game state for demo
  const playerHand = [
    { suit: 'hearts', rank: '5' },
    { suit: 'diamonds', rank: 'K' },
    { suit: 'clubs', rank: '7' },
    { suit: 'spades', rank: 'A' },
    { suit: 'hearts', rank: 'J' },
    { suit: 'diamonds', rank: '9' },
  ];

  const playedCards = [
    { suit: 'hearts', rank: '3', player: 'You' },
    { suit: 'clubs', rank: '8', player: 'Opponent' },
  ];

  // Fixed layout - no scrolling
  const containerStyle = {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #2b1810 0%, #1a0f0a 100%)',
  };

  const headerStyle = {
    flex: '0 0 auto',
    padding: '12px 16px',
    background: 'linear-gradient(135deg, #3e2723 0%, #2b1810 100%)',
    borderBottom: '2px solid #d4af37',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const pegBoardSectionStyle = {
    flex: '0 0 auto',
    padding: '16px',
    background: 'linear-gradient(135deg, #3e2723 0%, #5d4037 100%)',
    borderBottom: '2px solid #8b4513',
  };

  const playAreaSectionStyle = {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '16px',
    overflow: 'hidden',
    minHeight: 0,
  };

  const playerHandSectionStyle = {
    flex: '0 0 auto',
    padding: '16px',
    background: 'linear-gradient(135deg, #5d4037 0%, #3e2723 100%)',
    borderTop: '2px solid #d4af37',
    maxHeight: '180px',
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#d4af37',
    margin: 0,
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
  };

  const statusStyle = {
    fontSize: '14px',
    color: '#e8d4b0',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>🎴 Cribbage</h1>
        <div style={statusStyle}>
          {role === 'host' ? 'Hosting' : 'Guest'} • Connected
        </div>
      </div>

      {/* Peg Board Section */}
      <div style={pegBoardSectionStyle}>
        <PegBoard
          player1Score={playerScore}
          player2Score={opponentScore}
          player1Name="You"
          player2Name="Opponent"
        />
      </div>

      {/* Play Area Section */}
      <div style={playAreaSectionStyle}>
        <PlayArea
          playedCards={playedCards}
          currentCount={11}
          lastPoints={0}
          showCount={true}
        />
      </div>

      {/* Player Hand Section */}
      <div style={playerHandSectionStyle}>
        <Hand
          cards={playerHand}
          faceUp={true}
          selectable={true}
          selectedCards={selectedCards}
          onCardSelect={setSelectedCards}
          maxSelection={1}
        />
      </div>
    </div>
  );
}
