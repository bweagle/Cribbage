import { useState } from 'react';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/game/Card.jsx';
import { Hand } from '../components/game/Hand.jsx';
import { PlayArea } from '../components/game/PlayArea.jsx';
import { PegBoard } from '../components/game/PegBoard.jsx';

export function DemoView({ onBack }) {
  const [selectedCards, setSelectedCards] = useState([]);
  const [player1Score, setPlayer1Score] = useState(15);
  const [player2Score, setPlayer2Score] = useState(23);

  // Sample cards for demo
  const sampleHand = [
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
    { suit: 'diamonds', rank: '4', player: 'You' },
  ];

  const containerStyle = {
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f8f9fa',
  };

  const sectionStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
    marginBottom: '16px',
  };

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#2196F3', marginBottom: '24px', textAlign: 'center' }}>
          🎴 Cribbage UI Demo
        </h1>

        <Button onClick={onBack} style={{ marginBottom: '20px' }}>
          ← Back to Welcome
        </Button>

        {/* Peg Board Section */}
        <div style={sectionStyle}>
          <h2 style={titleStyle}>Peg Board (Score Tracker)</h2>
          <PegBoard
            player1Score={player1Score}
            player2Score={player2Score}
            player1Name="You"
            player2Name="Opponent"
          />
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'center' }}>
            <Button onClick={() => setPlayer1Score(Math.min(121, player1Score + 5))}>
              You +5
            </Button>
            <Button onClick={() => setPlayer2Score(Math.min(121, player2Score + 5))}>
              Opponent +5
            </Button>
            <Button variant="secondary" onClick={() => { setPlayer1Score(0); setPlayer2Score(0); }}>
              Reset
            </Button>
          </div>
        </div>

        {/* Play Area Section */}
        <div style={sectionStyle}>
          <h2 style={titleStyle}>Play Area</h2>
          <PlayArea
            playedCards={playedCards}
            currentCount={15}
            lastPoints={2}
            showCount={true}
          />
        </div>

        {/* Hand Selection Section */}
        <div style={sectionStyle}>
          <h2 style={titleStyle}>Your Hand (Selectable)</h2>
          <p style={{ color: '#6c757d', marginBottom: '16px', textAlign: 'center' }}>
            Click cards to select up to 2 for the crib
          </p>
          <Hand
            cards={sampleHand}
            faceUp={true}
            selectable={true}
            selectedCards={selectedCards}
            onCardSelect={setSelectedCards}
            maxSelection={2}
          />
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '16px', color: '#495057' }}>
            Selected: {selectedCards.length} / 2 cards
            {selectedCards.length === 2 && (
              <Button onClick={() => setSelectedCards([])} style={{ marginLeft: '12px' }}>
                Clear Selection
              </Button>
            )}
          </div>
        </div>

        {/* Individual Cards Section */}
        <div style={sectionStyle}>
          <h2 style={titleStyle}>Individual Cards</h2>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <Card suit="hearts" rank="A" faceUp={true} />
              <p style={{ fontSize: '12px', color: '#6c757d', marginTop: '8px' }}>Ace of Hearts</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Card suit="diamonds" rank="K" faceUp={true} />
              <p style={{ fontSize: '12px', color: '#6c757d', marginTop: '8px' }}>King of Diamonds</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Card suit="clubs" rank="7" faceUp={true} />
              <p style={{ fontSize: '12px', color: '#6c757d', marginTop: '8px' }}>7 of Clubs</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Card suit="spades" rank="Q" faceUp={true} />
              <p style={{ fontSize: '12px', color: '#6c757d', marginTop: '8px' }}>Queen of Spades</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Card faceUp={false} />
              <p style={{ fontSize: '12px', color: '#6c757d', marginTop: '8px' }}>Face Down</p>
            </div>
          </div>
        </div>

        {/* Opponent Hand Section */}
        <div style={sectionStyle}>
          <h2 style={titleStyle}>Opponent's Hand (Hidden)</h2>
          <Hand
            cards={sampleHand}
            faceUp={false}
            selectable={false}
            label="Opponent"
          />
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px', padding: '20px', background: 'white', borderRadius: '12px' }}>
          <h3 style={{ color: '#4CAF50', marginBottom: '12px' }}>✅ UI Components Ready!</h3>
          <p style={{ color: '#6c757d' }}>
            All game UI components are working. Bluetooth functionality will enable multiplayer gameplay.
          </p>
        </div>
      </div>
    </div>
  );
}
