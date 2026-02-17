// User-facing messages
export const MESSAGES = {
  // Platform support
  IOS_NOT_SUPPORTED: 'This game requires Web Bluetooth API, which is currently only supported on Android devices using Chrome or Edge browsers. Please use an Android device to play.',
  BLUETOOTH_NOT_SUPPORTED: 'Your browser does not support Web Bluetooth API. Please use Chrome or Edge on an Android device.',

  // Connection
  CONNECTING: 'Connecting to opponent...',
  CONNECTED: 'Connected successfully!',
  DISCONNECTED: 'Connection lost',
  RECONNECTING: 'Attempting to reconnect...',

  // Game states
  WAITING_FOR_OPPONENT: 'Waiting for opponent to select cards...',
  YOUR_TURN: 'Your turn',
  OPPONENT_TURN: "Opponent's turn",

  // Errors
  CONNECTION_FAILED: 'Failed to connect. Please try again.',
  BLUETOOTH_ERROR: 'Bluetooth error occurred',
  GAME_STATE_ERROR: 'Game state sync error',
};

// Game instructions
export const INSTRUCTIONS = {
  WELCOME: 'Welcome to Cribbage! Connect with a nearby player to start a game.',
  SELECT_CRIB: 'Select 2 cards to put in the crib',
  PLAY_PHASE: 'Play cards to reach 31. Score points for 15s, pairs, and runs.',
  COUNT_HAND: 'Count your hand and declare your points',
  MUGGINS: 'You can claim any points your opponent missed!',
};
