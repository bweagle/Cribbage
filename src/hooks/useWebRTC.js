import { useState, useEffect, useCallback } from 'react';
import webrtcService from '../utils/webrtc/webrtcService.js';

export function useWebRTC() {
  const [status, setStatus] = useState('disconnected'); // 'disconnected' | 'connecting' | 'connected' | 'error'
  const [roomCode, setRoomCode] = useState(null);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    // Check if WebRTC is supported
    setIsSupported(webrtcService.constructor.isSupported());

    // Poll for status updates
    const interval = setInterval(() => {
      const serviceStatus = webrtcService.getStatus();
      setStatus(serviceStatus.isConnected ? 'connected' : status);
      setIsHost(serviceStatus.isHost);
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  // Host a new game
  const hostGame = useCallback(async () => {
    setStatus('connecting');
    setError(null);

    try {
      const code = await webrtcService.initializeAsHost();
      setRoomCode(code);
      setIsHost(true);
      console.log('Room created with code:', code);
      // Status will be updated to 'connected' when guest joins
      return code;
    } catch (err) {
      console.error('Failed to host game:', err);
      setError(err.message);
      setStatus('error');
      throw err;
    }
  }, []);

  // Join an existing game
  const joinGame = useCallback(async (code) => {
    setStatus('connecting');
    setError(null);

    try {
      await webrtcService.connectToHost(code);
      setRoomCode(code);
      setIsHost(false);
      setStatus('connected');
      return true;
    } catch (err) {
      console.error('Failed to join game:', err);
      setError(err.message || 'Failed to join game. Check the room code and try again.');
      setStatus('error');
      throw err;
    }
  }, []);

  // Disconnect from game
  const disconnect = useCallback(async () => {
    try {
      await webrtcService.disconnect();
      setStatus('disconnected');
      setRoomCode(null);
      setError(null);
      setIsHost(false);
    } catch (err) {
      console.error('Disconnect error:', err);
      setError(err.message);
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(async (message) => {
    try {
      await webrtcService.sendMessage(message);
      return true;
    } catch (err) {
      console.error('Send message error:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  // Register message handler
  const onMessage = useCallback((handler) => {
    return webrtcService.onMessage(handler);
  }, []);

  return {
    status,
    roomCode,
    error,
    isSupported,
    isHost,
    hostGame,
    joinGame,
    disconnect,
    sendMessage,
    onMessage,
  };
}
