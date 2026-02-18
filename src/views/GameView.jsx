import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button.jsx';
import { Hand } from '../components/game/Hand.jsx';
import { PlayArea } from '../components/game/PlayArea.jsx';
import { PegBoard } from '../components/game/PegBoard.jsx';
import { useGameState } from '../hooks/useGameState.js';
import { MessageTypes } from '../constants/bluetoothConfig.js';

export function GameView({ connection, role, onBack }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSeed, setGameSeed] = useState(null);
  const [isDealer, setIsDealer] = useState(role === 'host');
  const [lastPoints, setLastPoints] = useState(0);

  const gameState = useGameState(gameSeed, isDealer);

  // Listen for WebRTC messages
  useEffect(() => {
    if (!connection) return;

    const unsubscribe = connection.onMessage((message) => {
      console.log('Game message received:', message);

      switch (message.type) {
        case MessageTypes.GAME_SEED:
          // Received game seed from host
          setGameSeed(message.payload.seed);
          setIsDealer(false); // Guest is not dealer first round
          break;

        case MessageTypes.CRIB_CARDS:
          // Opponent selected crib cards
          gameState.opponentConfirmedCrib(message.payload.cards);
          // Both players selected crib, start play phase
          if (gameState.playerSelectedForCrib.length === 0) {
            gameState.startPlayPhase();
          }
          break;

        case MessageTypes.PLAY_CARD:
          // Opponent played a card
          gameState.opponentPlayedCard(
            message.payload.card,
            message.payload.count,
            message.payload.points
          );
          if (message.payload.points > 0) {
            setLastPoints(message.payload.points);
            setTimeout(() => setLastPoints(0), 2000);
          }
          break;

        case MessageTypes.CALL_GO:
          // Opponent called "Go"
          gameState.addPlayerPoints(1); // Player gets 1 point for opponent's go
          setLastPoints(1);
          setTimeout(() => setLastPoints(0), 2000);
          break;

        default:
          break;
      }
    });

    return unsubscribe;
  }, [connection, gameState]);

  // Initialize game when seed is received
  useEffect(() => {
    if (gameSeed && !gameStarted) {
      gameState.initializeGame();
      setGameStarted(true);
    }
  }, [gameSeed, gameStarted, gameState]);

  // Handle confirming crib selection
  const handleConfirmCrib = async () => {
    const success = gameState.confirmCribSelection();
    if (success && connection) {
      // Send selected cards to opponent
      await connection.sendMessage({
        type: MessageTypes.CRIB_CARDS,
        timestamp: Date.now(),
        payload: { cards: gameState.playerSelectedForCrib },
        messageId: `crib_${Date.now()}`
      });

      // Check if opponent already confirmed
      if (gameState.crib.length >= 4) {
        gameState.startPlayPhase();
      }
    }
  };

  // Handle playing a card
  const handlePlayCard = async (card) => {
    const result = gameState.playCard(card);

    if (result.valid && connection) {
      // Send played card to opponent
      await connection.sendMessage({
        type: MessageTypes.PLAY_CARD,
        timestamp: Date.now(),
        payload: {
          card,
          count: result.newCount,
          points: result.points
        },
        messageId: `play_${Date.now()}`
      });

      if (result.points > 0) {
        setLastPoints(result.points);
        setTimeout(() => setLastPoints(0), 2000);
      }
    }
  };

  // Handle calling "Go"
  const handleCallGo = async () => {
    const result = gameState.callGo();

    if (connection) {
      await connection.sendMessage({
        type: MessageTypes.CALL_GO,
        timestamp: Date.now(),
        payload: { points: result.points },
        messageId: `go_${Date.now()}`
      });
    }
  };

  // Fixed layout styles
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
    overflow: 'auto',
    minHeight: 0,
  };

  const playerHandSectionStyle = {
    flex: '0 0 auto',
    padding: '16px',
    background: 'linear-gradient(135deg, #5d4037 0%, #3e2723 100%)',
    borderTop: '2px solid #d4af37',
    maxHeight: '200px',
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#d4af37',
    margin: 0,
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
  };

  const phaseStyle = {
    fontSize: '14px',
    color: '#e8d4b0',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
  };

  const messageStyle = {
    textAlign: 'center',
    fontSize: '18px',
    color: '#d4af37',
    padding: '20px',
    background: 'linear-gradient(135deg, #5d4037 0%, #3e2723 100%)',
    borderRadius: '12px',
    border: '2px solid #d4af37',
    margin: '20px',
  };

  // Show loading while waiting for game to start
  if (!gameStarted) {
    return (
      <div style={containerStyle}>
        <div style={{ ...playAreaSectionStyle, justifyContent: 'center', alignItems: 'center' }}>
          <h2 style={{ color: '#d4af37', marginBottom: '20px' }}>Initializing Game...</h2>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const getPhaseDisplay = () => {
    switch (gameState.phase) {
      case 'crib':
        return 'Select 2 cards for the crib';
      case 'play':
        return gameState.isPlayerTurn ? 'Your Turn' : "Opponent's Turn";
      case 'count':
        return 'Counting Hands';
      case 'game-over':
        return 'Game Over!';
      default:
        return 'Playing';
    }
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>🎴 Cribbage</h1>
        <div style={phaseStyle}>{getPhaseDisplay()}</div>
      </div>

      {/* Peg Board Section */}
      <div style={pegBoardSectionStyle}>
        <PegBoard
          player1Score={gameState.playerScore}
          player2Score={gameState.opponentScore}
          player1Name="You"
          player2Name="Opponent"
        />
      </div>

      {/* Play Area Section */}
      <div style={playAreaSectionStyle}>
        {gameState.phase === 'crib' && (
          <div style={messageStyle}>
            <p>Select 2 cards from your hand for the crib</p>
            <p style={{ fontSize: '14px', marginTop: '12px', color: '#8b7355' }}>
              Selected: {gameState.playerSelectedForCrib.length} / 2
            </p>
            {gameState.playerSelectedForCrib.length === 2 && (
              <Button onClick={handleConfirmCrib} style={{ marginTop: '16px' }}>
                Confirm Selection
              </Button>
            )}
          </div>
        )}

        {gameState.phase === 'play' && (
          <PlayArea
            playedCards={gameState.playedCards}
            currentCount={gameState.currentCount}
            lastPoints={lastPoints}
            showCount={true}
          />
        )}

        {gameState.phase === 'play' && gameState.isPlayerTurn && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Button onClick={handleCallGo} variant="secondary" size="medium">
              Call "Go"
            </Button>
          </div>
        )}

        {gameState.phase === 'count' && (
          <div style={messageStyle}>
            <p>Counting phase - not yet implemented</p>
            <p style={{ fontSize: '14px', marginTop: '12px', color: '#8b7355' }}>
              Manual scoring will be added next
            </p>
          </div>
        )}

        {gameState.phase === 'game-over' && (
          <div style={messageStyle}>
            <h2 style={{ color: '#d4af37', marginBottom: '16px' }}>
              {gameState.playerScore >= 121 ? 'You Win!' : 'Opponent Wins!'}
            </h2>
            <p>Final Score: {gameState.playerScore} - {gameState.opponentScore}</p>
            <Button onClick={onBack} style={{ marginTop: '20px' }}>
              Back to Lobby
            </Button>
          </div>
        )}
      </div>

      {/* Player Hand Section */}
      <div style={playerHandSectionStyle}>
        <Hand
          cards={gameState.playerHand}
          faceUp={true}
          selectable={gameState.phase === 'crib' || (gameState.phase === 'play' && gameState.isPlayerTurn)}
          selectedCards={gameState.playerSelectedForCrib}
          onCardSelect={gameState.phase === 'crib' ? gameState.selectCardsForCrib : handlePlayCard}
          maxSelection={gameState.phase === 'crib' ? 2 : 1}
        />
      </div>
    </div>
  );
}
