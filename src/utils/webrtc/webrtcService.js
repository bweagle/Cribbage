import Peer from 'peerjs';

/**
 * WebRTC service for peer-to-peer game communication
 * Uses PeerJS for signaling and connection management
 */
class WebRTCService {
  constructor() {
    this.peer = null;
    this.connection = null;
    this.isConnected = false;
    this.peerId = null;
    this.messageHandlers = [];
    this.isHost = false;
  }

  /**
   * Check if WebRTC is supported
   */
  static isSupported() {
    return typeof RTCPeerConnection !== 'undefined';
  }

  /**
   * Initialize as host - creates a new peer and generates room code
   */
  async initializeAsHost() {
    try {
      // Generate a simple 3-digit room code
      const roomCode = Math.floor(100 + Math.random() * 900).toString();

      this.peer = new Peer(`cribbage-${roomCode}`, {
        debug: 2, // Log level
      });

      this.isHost = true;

      return new Promise((resolve, reject) => {
        this.peer.on('open', (id) => {
          console.log('Peer initialized with ID:', id);
          this.peerId = id;
          resolve(roomCode);
        });

        this.peer.on('error', (err) => {
          console.error('Peer error:', err);
          reject(err);
        });

        // Listen for incoming connections
        this.peer.on('connection', (conn) => {
          console.log('Incoming connection from:', conn.peer);
          this.setupConnection(conn);
        });
      });
    } catch (error) {
      console.error('Failed to initialize as host:', error);
      throw error;
    }
  }

  /**
   * Initialize as guest and connect to host using room code
   */
  async connectToHost(roomCode) {
    try {
      // Create peer with random ID
      this.peer = new Peer({
        debug: 2,
      });

      this.isHost = false;

      return new Promise((resolve, reject) => {
        this.peer.on('open', (id) => {
          console.log('Guest peer initialized with ID:', id);
          this.peerId = id;

          // Connect to host using room code
          const hostId = `cribbage-${roomCode}`;
          const conn = this.peer.connect(hostId, {
            reliable: true, // Use reliable data channel
          });

          this.setupConnection(conn);

          // Wait for connection to open
          conn.on('open', () => {
            resolve(conn);
          });

          conn.on('error', (err) => {
            console.error('Connection error:', err);
            reject(err);
          });
        });

        this.peer.on('error', (err) => {
          console.error('Peer error:', err);
          reject(err);
        });
      });
    } catch (error) {
      console.error('Failed to connect to host:', error);
      throw error;
    }
  }

  /**
   * Setup connection event handlers
   */
  setupConnection(conn) {
    this.connection = conn;

    conn.on('open', () => {
      console.log('Connection opened with:', conn.peer);
      this.isConnected = true;
    });

    conn.on('data', (data) => {
      console.log('Received data:', data);
      try {
        const message = typeof data === 'string' ? JSON.parse(data) : data;
        this.handleMessage(message);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    });

    conn.on('close', () => {
      console.log('Connection closed');
      this.isConnected = false;
      this.notifyHandlers({ type: 'disconnected' });
    });

    conn.on('error', (err) => {
      console.error('Connection error:', err);
      this.isConnected = false;
    });
  }

  /**
   * Send a message to the connected peer
   */
  async sendMessage(message) {
    if (!this.connection || !this.isConnected) {
      throw new Error('Not connected to peer');
    }

    try {
      const messageString = JSON.stringify(message);
      this.connection.send(messageString);
      console.log('Message sent:', message);
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  /**
   * Handle incoming message
   */
  handleMessage(message) {
    this.notifyHandlers(message);
  }

  /**
   * Register a message handler
   */
  onMessage(handler) {
    this.messageHandlers.push(handler);

    // Return unsubscribe function
    return () => {
      const index = this.messageHandlers.indexOf(handler);
      if (index > -1) {
        this.messageHandlers.splice(index, 1);
      }
    };
  }

  /**
   * Notify all message handlers
   */
  notifyHandlers(message) {
    this.messageHandlers.forEach((handler) => {
      try {
        handler(message);
      } catch (error) {
        console.error('Error in message handler:', error);
      }
    });
  }

  /**
   * Disconnect from peer
   */
  async disconnect() {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }

    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    this.isConnected = false;
    this.peerId = null;
    this.isHost = false;
  }

  /**
   * Get current connection status
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      peerId: this.peerId,
      isHost: this.isHost,
    };
  }

  /**
   * Reconnect to the last peer (if possible)
   */
  async reconnect() {
    // WebRTC doesn't support reconnection in the same way as Bluetooth
    // Would need to re-establish connection with room code
    throw new Error('Reconnection not supported - please rejoin the room');
  }
}

// Create singleton instance
const webrtcService = new WebRTCService();

export default webrtcService;
