import { useState, useEffect, useCallback } from 'react';
import bluetoothService from '../utils/bluetooth/bluetoothService.js';

export function useBluetooth() {
  const [status, setStatus] = useState('disconnected'); // 'disconnected' | 'connecting' | 'connected' | 'error'
  const [device, setDevice] = useState(null);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if Bluetooth is supported
    setIsSupported(bluetoothService.constructor.isSupported());

    // Update status from service
    const updateStatus = () => {
      const serviceStatus = bluetoothService.getStatus();
      setDevice(serviceStatus.deviceName);
      setStatus(serviceStatus.isConnected ? 'connected' : 'disconnected');
    };

    updateStatus();

    // Poll for status updates (could be improved with events)
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  // Request and connect to a device
  const connect = useCallback(async () => {
    setStatus('connecting');
    setError(null);

    try {
      // Request device
      const selectedDevice = await bluetoothService.requestDevice();
      setDevice(selectedDevice.name);

      // Connect to device
      await bluetoothService.connect(selectedDevice);

      setStatus('connected');
      return selectedDevice;
    } catch (err) {
      console.error('Bluetooth connection error:', err);
      setError(err.message);
      setStatus('error');
      throw err;
    }
  }, []);

  // Disconnect from device
  const disconnect = useCallback(async () => {
    try {
      await bluetoothService.disconnect();
      setStatus('disconnected');
      setDevice(null);
      setError(null);
    } catch (err) {
      console.error('Disconnect error:', err);
      setError(err.message);
    }
  }, []);

  // Reconnect to device
  const reconnect = useCallback(async () => {
    setStatus('connecting');
    setError(null);

    try {
      await bluetoothService.reconnect();
      setStatus('connected');
      return true;
    } catch (err) {
      console.error('Reconnect error:', err);
      setError(err.message);
      setStatus('error');
      throw err;
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(async (message) => {
    try {
      await bluetoothService.sendMessage(message);
      return true;
    } catch (err) {
      console.error('Send message error:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  // Register message handler
  const onMessage = useCallback((handler) => {
    return bluetoothService.onMessage(handler);
  }, []);

  return {
    status,
    device,
    error,
    isSupported,
    connect,
    disconnect,
    reconnect,
    sendMessage,
    onMessage,
  };
}
