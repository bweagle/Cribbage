import { useState } from 'react';
import { Button } from '../components/ui/Button.jsx';
import { MESSAGES } from '../constants/messages.js';

export function LobbyView({ onGameReady, onBack }) {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null); // 'host' or 'guest'

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

  const handleHostGame = async () => {
    setRole('host');
    setError('Bluetooth hosting will be implemented in next phase');
    // TODO: Implement Bluetooth advertising
    // For now, just show a message
  };

  const handleJoinGame = async () => {
    setRole('guest');
    setIsScanning(true);
    setError(null);

    try {
      // TODO: Implement actual Bluetooth scanning
      // For now, simulate scanning
      setTimeout(() => {
        setDevices([
          { id: 'demo-1', name: 'Cribbage_Player1' },
          { id: 'demo-2', name: 'Cribbage_Player2' },
        ]);
        setIsScanning(false);
        setError('Bluetooth scanning will be fully implemented in next phase');
      }, 2000);

      /*
      // Real implementation will look like:
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: 'Cribbage_' }],
        optionalServices: [BLUETOOTH_CONFIG.SERVICE_UUID],
      });

      // Connect to device...
      */
    } catch (err) {
      setError(err.message);
      setIsScanning(false);
    }
  };

  const handleConnectToDevice = async (device) => {
    setConnecting(true);
    setError(null);

    try {
      // TODO: Implement actual Bluetooth connection
      setTimeout(() => {
        setConnecting(false);
        setError('Connection will be implemented with full Bluetooth support');
      }, 1500);
    } catch (err) {
      setError(err.message);
      setConnecting(false);
    }
  };

  const handleBack = () => {
    setRole(null);
    setDevices([]);
    setError(null);
    setIsScanning(false);
    onBack();
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>🎴 Game Lobby</h1>

      {!role && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
          <p style={{ textAlign: 'center', fontSize: '18px', color: '#495057', marginBottom: '20px' }}>
            Choose how to start the game:
          </p>

          <Button size="large" onClick={handleHostGame}>
            Host Game
          </Button>

          <Button size="large" variant="secondary" onClick={handleJoinGame}>
            Join Game
          </Button>

          <Button size="medium" variant="secondary" onClick={handleBack}>
            ← Back
          </Button>
        </div>
      )}

      {role === 'host' && (
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Hosting Game...</h2>
          <p style={{ color: '#6c757d', marginBottom: '20px' }}>
            Your device is now discoverable. Waiting for another player to join...
          </p>
          <div className="spinner"></div>
          <Button onClick={handleBack} style={{ marginTop: '40px' }}>
            Cancel
          </Button>
        </div>
      )}

      {role === 'guest' && (
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>
            {isScanning ? 'Scanning for Games...' : 'Available Games'}
          </h2>

          {isScanning && <div className="spinner"></div>}

          {!isScanning && devices.length === 0 && !error && (
            <p style={{ color: '#6c757d', marginBottom: '20px' }}>
              No games found nearby. Make sure the host has started their game.
            </p>
          )}

          {devices.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              {devices.map((device) => (
                <div
                  key={device.id}
                  style={{
                    padding: '16px',
                    border: '2px solid #dee2e6',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => handleConnectToDevice(device)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#2196F3';
                    e.currentTarget.style.backgroundColor = '#e3f2fd';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#dee2e6';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ fontWeight: '600', fontSize: '16px' }}>
                    {device.name}
                  </div>
                </div>
              ))}
            </div>
          )}

          {connecting && (
            <div style={{ marginTop: '20px' }}>
              <div className="spinner"></div>
              <p style={{ color: '#6c757d', marginTop: '12px' }}>
                Connecting...
              </p>
            </div>
          )}

          <Button onClick={handleBack} style={{ marginTop: '40px' }}>
            Cancel
          </Button>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#fff3cd',
            border: '2px solid #ffc107',
            borderRadius: '8px',
            color: '#856404',
            maxWidth: '500px',
          }}
        >
          <strong>Note:</strong> {error}
        </div>
      )}
    </div>
  );
}
