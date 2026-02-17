// Bluetooth service configuration
export const BLUETOOTH_CONFIG = {
  SERVICE_UUID: '0000180d-0000-1000-8000-00805f9b34fb',
  CHARACTERISTIC_UUID: '00002a37-0000-1000-8000-00805f9b34fb',
  DEVICE_NAME_PREFIX: 'Cribbage_',
  SCAN_TIMEOUT: 30000, // 30 seconds
  RECONNECT_ATTEMPTS: 3,
  RECONNECT_DELAY: 2000, // 2 seconds
};

// Message types for Bluetooth communication
export const MessageTypes = {
  // Connection
  HANDSHAKE: 'handshake',
  ACK: 'ack',

  // Game Setup
  GAME_SEED: 'game_seed',
  READY: 'ready',

  // Crib Phase
  CRIB_CARDS: 'crib_cards',
  CRIB_COMPLETE: 'crib_complete',

  // Play Phase
  PLAY_CARD: 'play_card',
  CALL_GO: 'call_go',
  PLAY_POINTS: 'play_points',

  // Scoring Phase
  DECLARE_SCORE: 'declare_score',
  MUGGINS_CLAIM: 'muggins_claim',
  SCORE_CONFIRM: 'score_confirm',

  // Game Control
  NEW_ROUND: 'new_round',
  GAME_OVER: 'game_over',

  // Error/Sync
  STATE_SYNC: 'state_sync',
  ERROR: 'error',
};
