import seedrandom from 'seedrandom';
import { SUITS, RANKS, CARD_VALUES, CARD_RANKS } from '../../constants/gameConfig.js';

// Create a standard 52-card deck
export function createStandardDeck() {
  const deck = [];

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        suit,
        rank,
        id: `${suit}_${rank}`,
      });
    }
  }

  return deck;
}

// Shuffle deck using Fisher-Yates algorithm with seeded RNG
export function createShuffledDeck(seed) {
  const rng = seedrandom(seed);
  const deck = createStandardDeck();

  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

// Get card value for play phase (A=1, face cards=10)
export function getCardValue(card) {
  return CARD_VALUES[card.rank];
}

// Get card rank for scoring (A=1, J=11, Q=12, K=13)
export function getCardRank(card) {
  return CARD_RANKS[card.rank];
}

// Deal cards to players
export function dealCards(deck, numCards, numPlayers) {
  const hands = Array(numPlayers).fill(null).map(() => []);
  let deckIndex = 0;

  // Deal cards alternating between players
  for (let i = 0; i < numCards; i++) {
    for (let p = 0; p < numPlayers; p++) {
      hands[p].push(deck[deckIndex++]);
    }
  }

  const remainingDeck = deck.slice(deckIndex);

  return { hands, remainingDeck };
}

// Generate a random seed for the game
export function generateGameSeed() {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

// Cut the deck to get starter card
export function cutDeck(deck, cutIndex) {
  if (cutIndex < 0 || cutIndex >= deck.length) {
    cutIndex = Math.floor(deck.length / 2);
  }

  const starterCard = deck[cutIndex];
  const remainingDeck = deck.filter((_, i) => i !== cutIndex);

  return { starterCard, remainingDeck };
}
