import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button.jsx';
import { MESSAGES } from '../constants/messages.js';

export function WelcomeView({ onStartGame, onViewDemo }) {
  const [isSupported, setIsSupported] = useState(false);
  const [platform, setPlatform] = useState('');

  useEffect(() => {
    // Check for WebRTC support (works on iOS, Android, and Desktop)
    const supported = typeof RTCPeerConnection !== 'undefined';
    setIsSupported(supported);

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('iOS');
    } else if (/android/.test(userAgent)) {
      setPlatform('Android');
    } else {
      setPlatform('Desktop');
    }
  }, []);

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    textAlign: 'center',
  };

  const titleStyle = {
    fontSize: '48px',
    fontWeight: '700',
    color: '#d4af37',
    marginBottom: '16px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
  };

  const subtitleStyle = {
    fontSize: '20px',
    color: '#e8d4b0',
    marginBottom: '40px',
  };

  const warningBoxStyle = {
    backgroundColor: '#fff3cd',
    border: '2px solid #ffc107',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '500px',
    margin: '20px auto',
  };

  const warningTitleStyle = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#856404',
    marginBottom: '12px',
  };

  const warningTextStyle = {
    fontSize: '16px',
    color: '#856404',
    lineHeight: '1.6',
  };

  if (!isSupported) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>🎴 Cribbage</h1>
        <div style={warningBoxStyle}>
          <h2 style={warningTitleStyle}>Browser Not Supported</h2>
          <p style={warningTextStyle}>
            Your browser doesn't support WebRTC, which is required for peer-to-peer gameplay.
            Please use a modern browser like Chrome, Safari, or Edge.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>🎴 Cribbage</h1>
      <p style={subtitleStyle}>Mobile peer-to-peer card game</p>

      <div style={{ marginBottom: '40px', maxWidth: '400px' }}>
        <p style={{ fontSize: '18px', color: '#e8d4b0', marginBottom: '20px' }}>
          Connect with another player using a simple room code and enjoy a classic game of cribbage!
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Button
          size="large"
          onClick={onStartGame}
        >
          Start Game
        </Button>

        {onViewDemo && (
          <Button
            size="medium"
            variant="secondary"
            onClick={onViewDemo}
          >
            View UI Demo
          </Button>
        )}
      </div>

      <div style={{
        marginTop: '60px',
        padding: '20px',
        background: 'linear-gradient(135deg, #5d4037 0%, #3e2723 100%)',
        borderRadius: '12px',
        maxWidth: '500px',
        border: '2px solid #d4af37',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6)'
      }}>
        <h3 style={{ fontSize: '20px', marginBottom: '16px', color: '#d4af37' }}>How to Play</h3>
        <div style={{ textAlign: 'left', fontSize: '16px', color: '#e8d4b0', lineHeight: '1.6' }}>
          <p>1. <strong>Host or Join:</strong> Host creates a 3-digit room code, other player joins</p>
          <p>2. <strong>Crib Phase:</strong> Select 2 cards for the crib</p>
          <p>3. <strong>Play Phase:</strong> Alternate playing cards (15s, pairs, runs score!)</p>
          <p>4. <strong>Count Hands:</strong> Enter your points manually</p>
          <p>5. <strong>First to 121 wins!</strong></p>
        </div>
      </div>

      <div style={{ marginTop: '40px', fontSize: '14px', color: '#8b7355' }}>
        <p>✓ {platform} - WebRTC supported!</p>
        <p style={{ marginTop: '8px' }}>Works on iOS, Android, and Desktop</p>
      </div>
    </div>
  );
}
