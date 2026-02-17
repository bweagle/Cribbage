import { getCardValue, getCardRank } from './deck.js';
import { GAME_RULES } from '../../constants/gameConfig.js';

// Calculate total score for a hand including starter card
export function calculateHandScore(hand, starterCard, isCrib = false) {
  const allCards = [...hand, starterCard];
  let totalPoints = 0;

  // Fifteens (2 pts each)
  totalPoints += countFifteens(allCards);

  // Pairs (2 pts each)
  totalPoints += countPairs(allCards);

  // Runs (1 pt per card)
  totalPoints += countRuns(allCards);

  // Flush (4-5 pts)
  totalPoints += countFlush(hand, starterCard, isCrib);

  // Nobs (1 pt) - Jack matching starter suit
  totalPoints += countNobs(hand, starterCard);

  return totalPoints;
}

// Count all combinations that sum to 15
export function countFifteens(cards) {
  let count = 0;
  const n = cards.length;

  // Check all possible subsets using bit manipulation
  for (let i = 1; i < (1 << n); i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      if (i & (1 << j)) {
        sum += getCardValue(cards[j]);
      }
    }
    if (sum === 15) {
      count++;
    }
  }

  return count * GAME_RULES.POINTS_FOR_15;
}

// Count all pairs in the hand
export function countPairs(cards) {
  let count = 0;

  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      if (getCardRank(cards[i]) === getCardRank(cards[j])) {
        count++;
      }
    }
  }

  return count * GAME_RULES.POINTS_FOR_PAIR;
}

// Count runs (sequences of 3+ cards)
export function countRuns(cards) {
  // Count occurrences of each rank
  const rankCounts = {};
  cards.forEach(card => {
    const rank = getCardRank(card);
    rankCounts[rank] = (rankCounts[rank] || 0) + 1;
  });

  const uniqueRanks = Object.keys(rankCounts).map(Number).sort((a, b) => a - b);

  // Find longest consecutive sequence
  let maxRunLength = 0;
  let maxRunStart = 0;

  for (let start = 0; start < uniqueRanks.length; start++) {
    let length = 1;
    for (let i = start + 1; i < uniqueRanks.length; i++) {
      if (uniqueRanks[i] === uniqueRanks[i - 1] + 1) {
        length++;
      } else {
        break;
      }
    }

    if (length >= 3 && length > maxRunLength) {
      maxRunLength = length;
      maxRunStart = start;
    }
  }

  if (maxRunLength === 0) return 0;

  // Calculate multiplier from duplicate cards in the run
  let multiplier = 1;
  for (let i = maxRunStart; i < maxRunStart + maxRunLength; i++) {
    multiplier *= rankCounts[uniqueRanks[i]];
  }

  return maxRunLength * multiplier;
}

// Count flush (all cards same suit)
export function countFlush(hand, starterCard, isCrib) {
  const handSuit = hand[0].suit;
  const allSameSuit = hand.every(card => card.suit === handSuit);

  if (!allSameSuit) return 0;

  // Crib requires all 5 cards (including starter) to be same suit
  if (isCrib) {
    return starterCard.suit === handSuit ? 5 : 0;
  }

  // Hand scores 4 for flush, 5 if starter matches
  return starterCard.suit === handSuit ? 5 : 4;
}

// Count nobs (Jack matching starter suit)
export function countNobs(hand, starterCard) {
  const hasNobs = hand.find(card =>
    card.rank === 'J' && card.suit === starterCard.suit
  );

  return hasNobs ? 1 : 0;
}

// Get a breakdown of points by category
export function getScoreBreakdown(hand, starterCard, isCrib = false) {
  const allCards = [...hand, starterCard];

  return {
    fifteens: countFifteens(allCards),
    pairs: countPairs(allCards),
    runs: countRuns(allCards),
    flush: countFlush(hand, starterCard, isCrib),
    nobs: countNobs(hand, starterCard),
    total: calculateHandScore(hand, starterCard, isCrib),
  };
}
