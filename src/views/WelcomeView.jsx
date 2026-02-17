import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button.jsx';
import { MESSAGES } from '../constants/messages.js';

export function WelcomeView({ onStartGame }) {
  const [isSupported, setIsSupported] = useState(false);
  const [platform, setPlatform] = useState('');

  useEffect(() => {
    // Check for Web Bluetooth support
    const supported = navigator.bluetooth !== undefined;
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
    color: '#2196F3',
    marginBottom: '16px',
  };

  const subtitleStyle = {
    fontSize: '20px',
    color: '#6c757d',
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
          <h2 style={warningTitleStyle}>Device Not Supported</h2>
          <p style={warningTextStyle}>
            {MESSAGES.BLUETOOTH_NOT_SUPPORTED}
          </p>
          {platform === 'iOS' && (
            <p style={{ ...warningTextStyle, marginTop: '16px' }}>
              <strong>iOS users:</strong> Safari does not support Web Bluetooth.
              Please use an Android device with Chrome or Edge to play.
            </p>
          )}
          {platform === 'Desktop' && (
            <p style={{ ...warningTextStyle, marginTop: '16px' }}>
              <strong>Desktop users:</strong> This game is designed for mobile
              devices with Bluetooth. Please use an Android phone or tablet.
            </p>
          )}
        </div>
        <div style={{ marginTop: '40px', color: '#6c757d' }}>
          <p>📱 Supported: Android 6+ with Chrome or Edge</p>
          <p>❌ Not supported: iOS, Firefox, Desktop browsers</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>🎴 Cribbage</h1>
      <p style={subtitleStyle}>Mobile peer-to-peer card game</p>

      <div style={{ marginBottom: '40px', maxWidth: '400px' }}>
        <p style={{ fontSize: '18px', color: '#495057', marginBottom: '20px' }}>
          Connect with a nearby player via Bluetooth and enjoy a classic game of cribbage!
        </p>
      </div>

      <Button
        size="large"
        onClick={onStartGame}
      >
        Start Game
      </Button>

      <div style={{ marginTop: '60px', padding: '20px', backgroundColor: 'white', borderRadius: '12px', maxWidth: '500px' }}>
        <h3 style={{ fontSize: '20px', marginBottom: '16px', color: '#212529' }}>How to Play</h3>
        <div style={{ textAlign: 'left', fontSize: '16px', color: '#495057', lineHeight: '1.6' }}>
          <p>1. <strong>Host or Join:</strong> One player hosts, the other joins</p>
          <p>2. <strong>Crib Phase:</strong> Select 2 cards for the crib</p>
          <p>3. <strong>Play Phase:</strong> Alternate playing cards (15s, pairs, runs score!)</p>
          <p>4. <strong>Count Hands:</strong> Declare your points (watch for muggins!)</p>
          <p>5. <strong>First to 121 wins!</strong></p>
        </div>
      </div>

      <div style={{ marginTop: '40px', fontSize: '14px', color: '#6c757d' }}>
        <p>✓ You're using {platform} - Bluetooth supported!</p>
      </div>
    </div>
  );
}
