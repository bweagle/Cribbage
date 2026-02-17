import { getCardValue, getCardRank } from './deck.js';
import { GAME_RULES } from '../../constants/gameConfig.js';

// Check if a card can be played given the current count
export function canPlayCard(card, currentCount) {
  const cardValue = getCardValue(card);
  return (currentCount + cardValue) <= GAME_RULES.MAX_COUNT;
}

// Check if player has any playable cards
export function hasPlayableCard(hand, currentCount) {
  return hand.some(card => canPlayCard(card, currentCount));
}

// Calculate points scored when playing a card
export function calculatePlayPoints(playedCards, newCard, newCount) {
  const allCards = [...playedCards, newCard];
  let points = 0;

  // Check for 15
  if (newCount === 15) {
    points += GAME_RULES.POINTS_FOR_15;
  }

  // Check for 31
  if (newCount === GAME_RULES.MAX_COUNT) {
    points += GAME_RULES.POINTS_FOR_31;
  }

  // Check for pairs (last 2, 3, or 4 cards of same rank)
  points += checkPairs(allCards);

  // Check for runs (last 3+ cards forming sequence)
  points += checkRuns(allCards);

  return points;
}

// Check for pairs in recently played cards
function checkPairs(cards) {
  if (cards.length < 2) return 0;

  const lastCard = cards[cards.length - 1];
  const lastRank = getCardRank(lastCard);
  let pairCount = 1;

  // Count consecutive cards of same rank from end
  for (let i = cards.length - 2; i >= 0; i--) {
    if (getCardRank(cards[i]) === lastRank) {
      pairCount++;
    } else {
      break;
    }
  }

  // 2 = pair (2 pts), 3 = triple (6 pts), 4 = quad (12 pts)
  const pairPoints = {
    2: 2,
    3: 6,
    4: 12,
  };

  return pairPoints[pairCount] || 0;
}

// Check for runs in recently played cards
function checkRuns(cards) {
  if (cards.length < 3) return 0;

  // Try runs of decreasing length starting from longest possible
  for (let runLength = Math.min(cards.length, 7); runLength >= 3; runLength--) {
    const lastCards = cards.slice(-runLength);
    if (isRun(lastCards)) {
      return runLength;
    }
  }

  return 0;
}

// Check if cards form a run (sequence)
function isRun(cards) {
  const ranks = cards.map(getCardRank).sort((a, b) => a - b);

  // Check if consecutive
  for (let i = 1; i < ranks.length; i++) {
    if (ranks[i] !== ranks[i - 1] + 1) {
      return false;
    }
  }

  return true;
}

// Determine if count should reset (both players called "Go")
export function shouldResetCount(playerCanPlay, opponentCanPlay) {
  return !playerCanPlay && !opponentCanPlay;
}

// Get points for "Go" (last card before reset)
export function getGoPoints(currentCount) {
  if (currentCount === GAME_RULES.MAX_COUNT) {
    return GAME_RULES.POINTS_FOR_31;
  }
  return GAME_RULES.POINTS_FOR_GO;
}
