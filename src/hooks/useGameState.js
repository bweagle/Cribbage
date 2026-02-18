import { useState, useCallback } from 'react';
import { createShuffledDeck } from '../utils/game/deck.js';

export function useGameState(seed, isDealer) {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [opponentHandCount, setOpponentHandCount] = useState(0);
  const [crib, setCrib] = useState([]);
  const [starterCard, setStarterCard] = useState(null);
  const [playedCards, setPlayedCards] = useState([]);
  const [currentCount, setCurrentCount] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [phase, setPhase] = useState('deal'); // 'deal' | 'crib' | 'play' | 'count' | 'game-over'
  const [isPlayerTurn, setIsPlayerTurn] = useState(!isDealer);
  const [playerSelectedForCrib, setPlayerSelectedForCrib] = useState([]);
  const [round, setRound] = useState(1);

  // Initialize game with seed
  const initializeGame = useCallback(() => {
    const shuffledDeck = createShuffledDeck(seed);
    setDeck(shuffledDeck);

    // Deal 6 cards to each player
    const playerCards = shuffledDeck.slice(0, 6);
    const opponentCards = shuffledDeck.slice(6, 12);

    setPlayerHand(playerCards);
    setOpponentHandCount(6);
    setDeck(shuffledDeck.slice(12)); // Rest of deck

    setPhase('crib');
    setPlayedCards([]);
    setCurrentCount(0);
    setPlayerSelectedForCrib([]);
  }, [seed]);

  // Player selects cards for crib
  const selectCardsForCrib = useCallback((cards) => {
    setPlayerSelectedForCrib(cards);
  }, []);

  // Confirm crib selection
  const confirmCribSelection = useCallback(() => {
    if (playerSelectedForCrib.length !== 2) {
      return false;
    }

    // Remove selected cards from hand
    const newHand = playerHand.filter(
      card => !playerSelectedForCrib.some(
        selected => selected.suit === card.suit && selected.rank === card.rank
      )
    );

    setPlayerHand(newHand);
    setCrib(prev => [...prev, ...playerSelectedForCrib]);
    setPlayerSelectedForCrib([]);

    return true;
  }, [playerHand, playerSelectedForCrib]);

  // Opponent confirms crib (called when message received)
  const opponentConfirmedCrib = useCallback((cards) => {
    setCrib(prev => [...prev, ...cards]);
    setOpponentHandCount(4); // Opponent now has 4 cards
  }, []);

  // Start play phase (cut starter card)
  const startPlayPhase = useCallback(() => {
    // Cut starter card from remaining deck
    const starter = deck[0];
    setStarterCard(starter);
    setDeck(deck.slice(1));
    setPhase('play');
  }, [deck]);

  // Play a card
  const playCard = useCallback((card) => {
    const cardValue = getCardValue(card);
    const newCount = currentCount + cardValue;

    if (newCount > 31) {
      return { valid: false, reason: 'Count exceeds 31' };
    }

    // Remove card from player hand
    const newHand = playerHand.filter(
      c => !(c.suit === card.suit && c.rank === card.rank)
    );

    setPlayerHand(newHand);
    setPlayedCards(prev => [...prev, { ...card, player: 'player' }]);
    setCurrentCount(newCount);
    setIsPlayerTurn(false);

    // Check for points (15, 31, pairs, runs)
    const points = calculatePlayPoints(newCount, playedCards, card);

    if (points > 0) {
      setPlayerScore(prev => prev + points);
    }

    return { valid: true, points, newCount };
  }, [playerHand, currentCount, playedCards]);

  // Opponent plays card (called when message received)
  const opponentPlayedCard = useCallback((card, newCount, points) => {
    setPlayedCards(prev => [...prev, { ...card, player: 'opponent' }]);
    setCurrentCount(newCount);
    setOpponentHandCount(prev => prev - 1);
    setIsPlayerTurn(true);

    if (points > 0) {
      setOpponentScore(prev => prev + points);
    }
  }, []);

  // Call "Go" when player can't play
  const callGo = useCallback(() => {
    setIsPlayerTurn(false);
    // Opponent will get 1 point for go
    return { points: 1 };
  }, []);

  // Reset count (when both players pass or reach 31)
  const resetCount = useCallback(() => {
    setCurrentCount(0);
    setPlayedCards([]);
  }, []);

  // Check if play phase is complete (all cards played or both players passed)
  const checkPlayComplete = useCallback(() => {
    // If both players have no cards left, move to counting
    if (playerHand.length === 0 && opponentHandCount === 0) {
      setPhase('count');
      return true;
    }
    return false;
  }, [playerHand.length, opponentHandCount]);

  // Move to counting phase
  const startCountingPhase = useCallback(() => {
    setPhase('count');
  }, []);

  // Add points from hand counting
  const addPlayerPoints = useCallback((points) => {
    setPlayerScore(prev => {
      const newScore = prev + points;
      if (newScore >= 121) {
        setPhase('game-over');
      }
      return newScore;
    });
  }, []);

  const addOpponentPoints = useCallback((points) => {
    setOpponentScore(prev => {
      const newScore = prev + points;
      if (newScore >= 121) {
        setPhase('game-over');
      }
      return newScore;
    });
  }, []);

  // Start next round
  const nextRound = useCallback(() => {
    setRound(prev => prev + 1);
    // Reset for new round
    setPlayerHand([]);
    setOpponentHandCount(0);
    setCrib([]);
    setStarterCard(null);
    setPlayedCards([]);
    setCurrentCount(0);
    setPlayerSelectedForCrib([]);
    // Switch dealer
    setIsPlayerTurn(prev => !prev);
    setPhase('deal');
    // Re-initialize with same seed for next round
    initializeGame();
  }, [initializeGame]);

  return {
    // State
    playerHand,
    opponentHandCount,
    crib,
    starterCard,
    playedCards,
    currentCount,
    playerScore,
    opponentScore,
    phase,
    isPlayerTurn,
    playerSelectedForCrib,
    round,
    isDealer,

    // Actions
    initializeGame,
    selectCardsForCrib,
    confirmCribSelection,
    opponentConfirmedCrib,
    startPlayPhase,
    playCard,
    opponentPlayedCard,
    callGo,
    resetCount,
    checkPlayComplete,
    startCountingPhase,
    addPlayerPoints,
    addOpponentPoints,
    nextRound,
  };
}

// Helper function to get card value for counting
function getCardValue(card) {
  if (card.rank === 'A') return 1;
  if (['J', 'Q', 'K'].includes(card.rank)) return 10;
  return parseInt(card.rank);
}

// Calculate points during play phase
function calculatePlayPoints(count, previousCards, newCard) {
  let points = 0;

  // 15 = 2 points
  if (count === 15) points += 2;

  // 31 = 2 points
  if (count === 31) points += 2;

  // Pairs, triples, quadruples
  const recentCards = [...previousCards.slice(-3), { ...newCard, player: 'player' }];
  const matchingRanks = recentCards.filter(c => c.rank === newCard.rank);

  if (matchingRanks.length === 2) points += 2; // Pair
  if (matchingRanks.length === 3) points += 6; // Triple (3 pairs)
  if (matchingRanks.length === 4) points += 12; // Quadruple (6 pairs)

  // Runs (3+ consecutive cards)
  // TODO: Implement run detection during play

  return points;
}
