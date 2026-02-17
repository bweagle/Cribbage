import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button.jsx';
import { useBluetooth } from '../hooks/useBluetooth.js';
import { MessageTypes } from '../constants/bluetoothConfig.js';

export function LobbyView({ onGameReady, onBack }) {
  const { status, device, error, connect, sendMessage, onMessage } = useBluetooth();
  const [role, setRole] = useState(null); // 'host' or 'guest'
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
            onGameReady({ sendMessage, onMessage }, role);
          }, 1000);
          break;

        case 'disconnected':
          // Handle disconnection
          console.log('Bluetooth disconnected');
          break;

        default:
          console.log('Unknown message type:', message.type);
      }
    });

    return unsubscribe;
  }, [onMessage, sendMessage, role, onGameReady]);

  // Auto-send handshake when connected
  useEffect(() => {
    if (status === 'connected' && role) {
      // Send initial handshake
      sendMessage({
        type: MessageTypes.HANDSHAKE,
        timestamp: Date.now(),
        payload: { role },
        messageId: `handshake_${Date.now()}`
      });

      // If host, generate and send game seed
      if (role === 'host') {
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
            onGameReady({ sendMessage, onMessage }, role);
          }, 1000);
        }, 500);
      }
    }
  }, [status, role, sendMessage, onMessage, onGameReady]);

  const handleHostGame = async () => {
    setRole('host');
    try {
      await connect();
    } catch (err) {
      console.error('Failed to host game:', err);
    }
  };

  const handleJoinGame = async () => {
    setRole('guest');
    try {
      await connect();
    } catch (err) {
      console.error('Failed to join game:', err);
    }
  };

  const handleBack = () => {
    setRole(null);
    setGameId(null);
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
    color: '#2196F3',
    marginBottom: '16px',
  };

  const statusBoxStyle = {
    padding: '20px',
    borderRadius: '12px',
    maxWidth: '500px',
    textAlign: 'center',
    marginTop: '20px',
  };

  const getStatusBox = () => {
    if (error) {
      return {
        ...statusBoxStyle,
        backgroundColor: '#ffebee',
        border: '2px solid #f44336',
        color: '#c62828',
      };
    }
    if (status === 'connected') {
      return {
        ...statusBoxStyle,
        backgroundColor: '#e8f5e9',
        border: '2px solid #4caf50',
        color: '#2e7d32',
      };
    }
    if (status === 'connecting') {
      return {
        ...statusBoxStyle,
        backgroundColor: '#e3f2fd',
        border: '2px solid #2196f3',
        color: '#1565c0',
      };
    }
    return statusBoxStyle;
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>🎴 Game Lobby</h1>

      {!role && status === 'disconnected' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
          <p style={{ textAlign: 'center', fontSize: '18px', color: '#495057', marginBottom: '20px' }}>
            Choose how to start the game:
          </p>

          <Button size="large" onClick={handleJoinGame}>
            🔍 Scan for Games
          </Button>

          <div style={{ textAlign: 'center', color: '#6c757d', margin: '10px 0' }}>
            <p style={{ fontSize: '14px' }}>
              This will scan for nearby devices.<br />
              The other player should also scan.
            </p>
          </div>

          <Button size="medium" variant="secondary" onClick={handleBack}>
            ← Back
          </Button>
        </div>
      )}

      {role === 'host' && (
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#212529' }}>
            {status === 'connected' ? '✓ Connected!' : 'Hosting Game...'}
          </h2>

          {status === 'connecting' && (
            <>
              <p style={{ color: '#6c757d', marginBottom: '20px' }}>
                Your device is now discoverable. Waiting for another player to join...
              </p>
              <div className="spinner"></div>
            </>
          )}

          {status === 'connected' && (
            <div style={getStatusBox()}>
              <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Connected to: {device}
              </p>
              <p>Starting game...</p>
              <div className="spinner" style={{ marginTop: '20px' }}></div>
            </div>
          )}

          {status !== 'connected' && (
            <Button onClick={handleBack} style={{ marginTop: '40px' }}>
              Cancel
            </Button>
          )}
        </div>
      )}

      {role === 'guest' && (
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#212529' }}>
            {status === 'connected' ? '✓ Connected!' : 'Scanning for Games...'}
          </h2>

          {status === 'connecting' && (
            <>
              <p style={{ color: '#6c757d', marginBottom: '20px' }}>
                Looking for nearby Cribbage games...
              </p>
              <div className="spinner"></div>
              <p style={{ color: '#6c757d', marginTop: '20px', fontSize: '14px' }}>
                Make sure Bluetooth is enabled and the other device is in range.
              </p>
            </>
          )}

          {status === 'connected' && (
            <div style={getStatusBox()}>
              <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Connected to: {device}
              </p>
              <p>Waiting for game to start...</p>
              <div className="spinner" style={{ marginTop: '20px' }}></div>
            </div>
          )}

          {status !== 'connected' && (
            <Button onClick={handleBack} style={{ marginTop: '40px' }}>
              Cancel
            </Button>
          )}
        </div>
      )}

      {error && (
        <div style={getStatusBox()}>
          <strong>Error:</strong> {error}
          <p style={{ fontSize: '14px', marginTop: '12px' }}>
            Make sure Bluetooth is enabled and try again.
          </p>
        </div>
      )}

      {status === 'connected' && !error && (
        <div style={{ marginTop: '20px', fontSize: '14px', color: '#6c757d' }}>
          <p>✓ Bluetooth connected</p>
          <p>Device: {device}</p>
        </div>
      )}
    </div>
  );
}
