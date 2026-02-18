import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button.jsx';
import { useWebRTC } from '../hooks/useWebRTC.js';
import { MessageTypes } from '../constants/bluetoothConfig.js';

export function LobbyView({ onGameReady, onBack }) {
  const { status, roomCode, error, hostGame, joinGame, sendMessage, onMessage, isHost } = useWebRTC();
  const [mode, setMode] = useState(null); // 'host' or 'join'
  const [inputCode, setInputCode] = useState('');
  const [gameId, setGameId] = useState(null);

  // Listen for messages
  useEffect(() => {
    const unsubscribe = onMessage((message) => {
      console.log('Received message in lobby:', message);

      switch (message.type) {
        case MessageTypes.HANDSHAKE:
          // Respond to handshake
          sendMessage({
            type: MessageTypes.ACK,
            timestamp: Date.now(),
            messageId: `ack_${Date.now()}`
          });
          break;

        case MessageTypes.GAME_SEED:
          // Game seed received, we can start
          setGameId(message.payload.seed);
          console.log('Game seed received:', message.payload.seed);
          // Ready to start game
          setTimeout(() => {
            onGameReady({ sendMessage, onMessage }, isHost ? 'host' : 'guest');
          }, 1000);
          break;

        case 'disconnected':
          // Handle disconnection
          console.log('Peer disconnected');
          break;

        default:
          console.log('Unknown message type:', message.type);
      }
    });

    return unsubscribe;
  }, [onMessage, sendMessage, isHost, onGameReady]);

  // Auto-send handshake when connected
  useEffect(() => {
    if (status === 'connected' && mode) {
      // Send initial handshake
      sendMessage({
        type: MessageTypes.HANDSHAKE,
        timestamp: Date.now(),
        payload: { role: isHost ? 'host' : 'guest' },
        messageId: `handshake_${Date.now()}`
      });

      // If host, generate and send game seed
      if (isHost) {
        const seed = Math.random().toString(36).substring(2, 15);
        setGameId(seed);

        setTimeout(() => {
          sendMessage({
            type: MessageTypes.GAME_SEED,
            timestamp: Date.now(),
            payload: { seed, hostDealer: true },
            messageId: `seed_${Date.now()}`
          });

          // Start game after sending seed
          setTimeout(() => {
            onGameReady({ sendMessage, onMessage }, 'host');
          }, 1000);
        }, 500);
      }
    }
  }, [status, mode, sendMessage, onMessage, onGameReady, isHost]);

  const handleHostGame = async () => {
    setMode('host');
    try {
      await hostGame();
    } catch (err) {
      console.error('Failed to host game:', err);
    }
  };

  const handleJoinGame = async () => {
    if (!inputCode || inputCode.length !== 3) {
      alert('Please enter a valid 3-digit room code');
      return;
    }

    setMode('join');
    try {
      await joinGame(inputCode);
    } catch (err) {
      console.error('Failed to join game:', err);
    }
  };

  const handleBack = () => {
    setMode(null);
    setGameId(null);
    setInputCode('');
    onBack();
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#d4af37',
    marginBottom: '16px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
  };

  const statusBoxStyle = {
    padding: '20px',
    borderRadius: '12px',
    maxWidth: '500px',
    textAlign: 'center',
    marginTop: '20px',
  };

  const roomCodeBoxStyle = {
    background: 'linear-gradient(135deg, #5d4037 0%, #3e2723 100%)',
    border: '3px solid #d4af37',
    padding: '40px',
    borderRadius: '16px',
    marginTop: '20px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.6)',
  };

  const roomCodeStyle = {
    fontSize: '72px',
    fontWeight: '700',
    color: '#d4af37',
    letterSpacing: '16px',
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.8)',
    marginBottom: '16px',
  };

  const inputStyle = {
    fontSize: '48px',
    fontWeight: '700',
    textAlign: 'center',
    width: '200px',
    padding: '16px',
    borderRadius: '8px',
    border: '3px solid #d4af37',
    background: 'linear-gradient(135deg, #5d4037 0%, #3e2723 100%)',
    color: '#d4af37',
    letterSpacing: '16px',
    marginBottom: '20px',
  };

  const getStatusBox = () => {
    if (error) {
      return {
        ...statusBoxStyle,
        background: 'linear-gradient(135deg, #8b0000 0%, #600000 100%)',
        border: '2px solid #600000',
        color: '#e8d4b0',
      };
    }
    if (status === 'connected') {
      return {
        ...statusBoxStyle,
        background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
        border: '2px solid #4caf50',
        color: '#e8d4b0',
      };
    }
    if (status === 'connecting') {
      return {
        ...statusBoxStyle,
        background: 'linear-gradient(135deg, #5d4037 0%, #3e2723 100%)',
        border: '2px solid #d4af37',
        color: '#e8d4b0',
      };
    }
    return statusBoxStyle;
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>🎴 Game Lobby</h1>

      {!mode && status === 'disconnected' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
          <p style={{ textAlign: 'center', fontSize: '18px', color: '#e8d4b0', marginBottom: '20px' }}>
            Choose how to start the game:
          </p>

          <Button size="large" onClick={handleHostGame}>
            🏠 Host Game
          </Button>

          <div style={{ textAlign: 'center', color: '#8b7355', margin: '10px 0' }}>
            <p style={{ fontSize: '14px' }}>or</p>
          </div>

          <Button size="large" variant="secondary" onClick={() => setMode('join')}>
            🔗 Join Game
          </Button>

          <Button size="medium" variant="secondary" onClick={handleBack} style={{ marginTop: '20px' }}>
            ← Back
          </Button>
        </div>
      )}

      {mode === 'host' && !roomCode && (
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#e8d4b0' }}>
            Creating Room...
          </h2>
          <div className="spinner"></div>
        </div>
      )}

      {mode === 'host' && roomCode && status !== 'connected' && (
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#e8d4b0' }}>
            Room Created!
          </h2>
          <p style={{ color: '#8b7355', marginBottom: '20px' }}>
            Share this code with your opponent:
          </p>

          <div style={roomCodeBoxStyle}>
            <div style={roomCodeStyle}>{roomCode}</div>
            <p style={{ fontSize: '18px', color: '#8b7355' }}>
              Waiting for opponent to join...
            </p>
            <div className="spinner" style={{ marginTop: '20px' }}></div>
          </div>

          <Button onClick={handleBack} style={{ marginTop: '40px' }}>
            Cancel
          </Button>
        </div>
      )}

      {mode === 'host' && status === 'connected' && (
        <div style={getStatusBox()}>
          <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            ✓ Opponent Connected!
          </p>
          <p>Starting game...</p>
          <div className="spinner" style={{ marginTop: '20px' }}></div>
        </div>
      )}

      {mode === 'join' && status === 'disconnected' && (
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#e8d4b0' }}>
            Enter Room Code
          </h2>
          <p style={{ color: '#8b7355', marginBottom: '20px' }}>
            Enter the 3-digit code from your opponent:
          </p>

          <input
            type="text"
            maxLength="3"
            pattern="[0-9]*"
            inputMode="numeric"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
            style={inputStyle}
            placeholder="---"
            autoFocus
          />

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Button
              size="large"
              onClick={handleJoinGame}
              disabled={inputCode.length !== 3}
            >
              Join Game
            </Button>
            <Button
              size="large"
              variant="secondary"
              onClick={handleBack}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {mode === 'join' && status === 'connecting' && (
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#e8d4b0' }}>
            Connecting...
          </h2>
          <p style={{ color: '#8b7355', marginBottom: '20px' }}>
            Joining room {inputCode}...
          </p>
          <div className="spinner"></div>
        </div>
      )}

      {mode === 'join' && status === 'connected' && (
        <div style={getStatusBox()}>
          <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            ✓ Connected!
          </p>
          <p>Waiting for game to start...</p>
          <div className="spinner" style={{ marginTop: '20px' }}></div>
        </div>
      )}

      {error && (
        <div style={getStatusBox()}>
          <strong>Error:</strong> {error}
          <p style={{ fontSize: '14px', marginTop: '12px' }}>
            Please check the room code and try again.
          </p>
        </div>
      )}
    </div>
  );
}
