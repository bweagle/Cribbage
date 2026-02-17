import { BLUETOOTH_CONFIG } from '../../constants/bluetoothConfig.js';

export class BluetoothService {
  constructor() {
    this.device = null;
    this.server = null;
    this.service = null;
    this.characteristic = null;
    this.isConnected = false;
    this.messageHandlers = [];
  }

  // Check if Web Bluetooth is supported
  static isSupported() {
    return navigator.bluetooth !== undefined;
  }

  // Request and connect to a Bluetooth device
  async requestDevice() {
    if (!BluetoothService.isSupported()) {
      throw new Error('Web Bluetooth API is not supported in this browser');
    }

    try {
      console.log('Requesting Bluetooth device...');

      // Request device with our custom service
      this.device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: BLUETOOTH_CONFIG.DEVICE_NAME_PREFIX }
        ],
        optionalServices: [BLUETOOTH_CONFIG.SERVICE_UUID]
      });

      console.log('Device selected:', this.device.name);

      // Listen for disconnection
      this.device.addEventListener('gattserverdisconnected', () => {
        console.log('Device disconnected');
        this.isConnected = false;
        this.notifyDisconnection();
      });

      return this.device;
    } catch (error) {
      console.error('Error requesting device:', error);
      throw error;
    }
  }

  // Connect to the GATT server
  async connect(device = this.device) {
    if (!device) {
      throw new Error('No device available. Call requestDevice() first.');
    }

    try {
      console.log('Connecting to GATT server...');
      this.server = await device.gatt.connect();
      console.log('Connected to GATT server');

      console.log('Getting primary service...');
      this.service = await this.server.getPrimaryService(BLUETOOTH_CONFIG.SERVICE_UUID);
      console.log('Got primary service');

      console.log('Getting characteristic...');
      this.characteristic = await this.service.getCharacteristic(BLUETOOTH_CONFIG.CHARACTERISTIC_UUID);
      console.log('Got characteristic');

      // Start listening for notifications
      await this.startNotifications();

      this.isConnected = true;
      return true;
    } catch (error) {
      console.error('Error connecting to device:', error);
      this.isConnected = false;
      throw error;
    }
  }

  // Start listening for notifications
  async startNotifications() {
    if (!this.characteristic) {
      throw new Error('No characteristic available');
    }

    try {
      await this.characteristic.startNotifications();
      console.log('Notifications started');

      this.characteristic.addEventListener('characteristicvaluechanged', (event) => {
        const value = event.target.value;
        const message = this.decodeMessage(value);
        console.log('Received message:', message);
        this.handleIncomingMessage(message);
      });
    } catch (error) {
      console.error('Error starting notifications:', error);
      throw error;
    }
  }

  // Send a message
  async sendMessage(message) {
    if (!this.isConnected || !this.characteristic) {
      throw new Error('Not connected to a device');
    }

    try {
      const encodedMessage = this.encodeMessage(message);
      await this.characteristic.writeValue(encodedMessage);
      console.log('Message sent:', message);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Encode message to ArrayBuffer
  encodeMessage(message) {
    const messageString = JSON.stringify(message);
    const encoder = new TextEncoder();
    return encoder.encode(messageString);
  }

  // Decode message from DataView
  decodeMessage(dataView) {
    const decoder = new TextDecoder();
    const messageString = decoder.decode(dataView);
    try {
      return JSON.parse(messageString);
    } catch (error) {
      console.error('Error parsing message:', error);
      return { type: 'error', error: 'Failed to parse message' };
    }
  }

  // Register a message handler
  onMessage(handler) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  // Handle incoming message
  handleIncomingMessage(message) {
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('Error in message handler:', error);
      }
    });
  }

  // Notify about disconnection
  notifyDisconnection() {
    this.handleIncomingMessage({
      type: 'disconnected',
      timestamp: Date.now()
    });
  }

  // Disconnect from device
  async disconnect() {
    if (this.device && this.device.gatt.connected) {
      try {
        await this.device.gatt.disconnect();
        console.log('Disconnected from device');
      } catch (error) {
        console.error('Error disconnecting:', error);
      }
    }

    this.device = null;
    this.server = null;
    this.service = null;
    this.characteristic = null;
    this.isConnected = false;
  }

  // Reconnect to device
  async reconnect() {
    if (!this.device) {
      throw new Error('No device to reconnect to');
    }

    let attempts = 0;
    const maxAttempts = BLUETOOTH_CONFIG.RECONNECT_ATTEMPTS;

    while (attempts < maxAttempts) {
      try {
        console.log(`Reconnection attempt ${attempts + 1}/${maxAttempts}`);
        await this.connect(this.device);
        console.log('Reconnected successfully');
        return true;
      } catch (error) {
        attempts++;
        if (attempts < maxAttempts) {
          console.log(`Waiting ${BLUETOOTH_CONFIG.RECONNECT_DELAY}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, BLUETOOTH_CONFIG.RECONNECT_DELAY));
        }
      }
    }

    throw new Error(`Failed to reconnect after ${maxAttempts} attempts`);
  }

  // Get connection status
  getStatus() {
    return {
      isConnected: this.isConnected,
      deviceName: this.device?.name || null,
      deviceId: this.device?.id || null,
    };
  }
}

// Create singleton instance
const bluetoothService = new BluetoothService();

export default bluetoothService;
