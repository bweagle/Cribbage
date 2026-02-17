// Card configuration
export const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Card values for play phase (A=1, face cards=10)
export const CARD_VALUES = {
  'A': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'J': 10,
  'Q': 10,
  'K': 10,
};

// Card rank numbers for scoring (A=1, J=11, Q=12, K=13)
export const CARD_RANKS = {
  'A': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'J': 11,
  'Q': 12,
  'K': 13,
};

// Game rules
export const GAME_RULES = {
  WINNING_SCORE: 121,
  MAX_COUNT: 31,
  CARDS_DEALT_2_PLAYER: 6,
  CARDS_TO_CRIB: 2,
  POINTS_FOR_15: 2,
  POINTS_FOR_PAIR: 2,
  POINTS_FOR_31: 2,
  POINTS_FOR_GO: 1,
  MUGGINS_TIMEOUT: 15000, // 15 seconds
};

// Game phases
export const GAME_PHASES = {
  DEAL: 'deal',
  CRIB: 'crib',
  PLAY: 'play',
  COUNT_PLAYER: 'count-player',
  COUNT_OPPONENT: 'count-opponent',
  COUNT_CRIB: 'count-crib',
  GAME_OVER: 'game-over',
};

// Suit symbols
export const SUIT_SYMBOLS = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

// Suit colors
export const SUIT_COLORS = {
  hearts: 'red',
  diamonds: 'red',
  clubs: 'black',
  spades: 'black',
};
