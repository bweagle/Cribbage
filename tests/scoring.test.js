import { describe, it, expect } from 'vitest';
import {
  calculateHandScore,
  countFifteens,
  countPairs,
  countRuns,
  countFlush,
  countNobs,
} from '../src/utils/game/scoring.js';

describe('Cribbage Scoring', () => {
  describe('countFifteens', () => {
    it('counts single fifteen correctly', () => {
      const cards = [
        { suit: 'hearts', rank: '5' },
        { suit: 'clubs', rank: '10' },
        { suit: 'spades', rank: '2' },
        { suit: 'diamonds', rank: '3' },
        { suit: 'hearts', rank: '7' },
      ];
      // 5+10=15, 2+3+10=15, 5+3+7=15 = 3 fifteens = 6 pts
      expect(countFifteens(cards)).toBe(6);
    });

    it('counts multiple fifteens', () => {
      const cards = [
        { suit: 'hearts', rank: '5' },
        { suit: 'clubs', rank: '5' },
        { suit: 'spades', rank: '5' },
        { suit: 'diamonds', rank: 'K' },
        { suit: 'hearts', rank: 'J' },
      ];
      // Each 5 + K = 15 (3), Each 5 + J = 15 (3), 5+5+5 = 15 (1) = 7 combos * 2 pts = 14
      expect(countFifteens(cards)).toBe(14);
    });
  });

  describe('countPairs', () => {
    it('counts a single pair', () => {
      const cards = [
        { suit: 'hearts', rank: '5' },
        { suit: 'clubs', rank: '5' },
        { suit: 'spades', rank: 'K' },
        { suit: 'diamonds', rank: 'Q' },
        { suit: 'hearts', rank: 'J' },
      ];
      expect(countPairs(cards)).toBe(2);
    });

    it('counts three of a kind', () => {
      const cards = [
        { suit: 'hearts', rank: '5' },
        { suit: 'clubs', rank: '5' },
        { suit: 'spades', rank: '5' },
        { suit: 'diamonds', rank: 'Q' },
        { suit: 'hearts', rank: 'J' },
      ];
      // 3 cards = 3 pairs = 6 pts
      expect(countPairs(cards)).toBe(6);
    });

    it('counts four of a kind', () => {
      const cards = [
        { suit: 'hearts', rank: '5' },
        { suit: 'clubs', rank: '5' },
        { suit: 'spades', rank: '5' },
        { suit: 'diamonds', rank: '5' },
        { suit: 'hearts', rank: 'J' },
      ];
      // 4 cards = 6 pairs = 12 pts
      expect(countPairs(cards)).toBe(12);
    });
  });

  describe('countRuns', () => {
    it('counts a simple 3-card run', () => {
      const cards = [
        { suit: 'hearts', rank: '5' },
        { suit: 'clubs', rank: '6' },
        { suit: 'spades', rank: '7' },
        { suit: 'diamonds', rank: 'K' },
        { suit: 'hearts', rank: 'J' },
      ];
      expect(countRuns(cards)).toBe(3);
    });

    it('counts a 4-card run', () => {
      const cards = [
        { suit: 'hearts', rank: '5' },
        { suit: 'clubs', rank: '6' },
        { suit: 'spades', rank: '7' },
        { suit: 'diamonds', rank: '8' },
        { suit: 'hearts', rank: 'J' },
      ];
      expect(countRuns(cards)).toBe(4);
    });

    it('counts a 5-card run', () => {
      const cards = [
        { suit: 'hearts', rank: '5' },
        { suit: 'clubs', rank: '6' },
        { suit: 'spades', rank: '7' },
        { suit: 'diamonds', rank: '8' },
        { suit: 'hearts', rank: '9' },
      ];
      expect(countRuns(cards)).toBe(5);
    });

    it('counts double run (with pair)', () => {
      const cards = [
        { suit: 'hearts', rank: '5' },
        { suit: 'clubs', rank: '5' },
        { suit: 'spades', rank: '6' },
        { suit: 'diamonds', rank: '7' },
        { suit: 'hearts', rank: 'J' },
      ];
      // Two 3-card runs: 5-6-7 and 5-6-7 = 6 pts
      expect(countRuns(cards)).toBe(6);
    });

    it('returns 0 for no run', () => {
      const cards = [
        { suit: 'hearts', rank: '5' },
        { suit: 'clubs', rank: '7' },
        { suit: 'spades', rank: '9' },
        { suit: 'diamonds', rank: 'K' },
        { suit: 'hearts', rank: 'J' },
      ];
      expect(countRuns(cards)).toBe(0);
    });
  });

  describe('countFlush', () => {
    it('counts 4-card flush in hand', () => {
      const hand = [
        { suit: 'hearts', rank: '5' },
        { suit: 'hearts', rank: '6' },
        { suit: 'hearts', rank: '7' },
        { suit: 'hearts', rank: '8' },
      ];
      const starter = { suit: 'clubs', rank: 'K' };
      expect(countFlush(hand, starter, false)).toBe(4);
    });

    it('counts 5-card flush in hand', () => {
      const hand = [
        { suit: 'hearts', rank: '5' },
        { suit: 'hearts', rank: '6' },
        { suit: 'hearts', rank: '7' },
        { suit: 'hearts', rank: '8' },
      ];
      const starter = { suit: 'hearts', rank: 'K' };
      expect(countFlush(hand, starter, false)).toBe(5);
    });

    it('requires 5 cards for crib flush', () => {
      const hand = [
        { suit: 'hearts', rank: '5' },
        { suit: 'hearts', rank: '6' },
        { suit: 'hearts', rank: '7' },
        { suit: 'hearts', rank: '8' },
      ];
      const starter = { suit: 'clubs', rank: 'K' };
      expect(countFlush(hand, starter, true)).toBe(0);
    });

    it('counts 5-card crib flush', () => {
      const hand = [
        { suit: 'hearts', rank: '5' },
        { suit: 'hearts', rank: '6' },
        { suit: 'hearts', rank: '7' },
        { suit: 'hearts', rank: '8' },
      ];
      const starter = { suit: 'hearts', rank: 'K' };
      expect(countFlush(hand, starter, true)).toBe(5);
    });

    it('returns 0 for no flush', () => {
      const hand = [
        { suit: 'hearts', rank: '5' },
        { suit: 'clubs', rank: '6' },
        { suit: 'hearts', rank: '7' },
        { suit: 'hearts', rank: '8' },
      ];
      const starter = { suit: 'hearts', rank: 'K' };
      expect(countFlush(hand, starter, false)).toBe(0);
    });
  });

  describe('countNobs', () => {
    it('counts nobs when Jack matches starter suit', () => {
      const hand = [
        { suit: 'hearts', rank: 'J' },
        { suit: 'clubs', rank: '6' },
        { suit: 'spades', rank: '7' },
        { suit: 'diamonds', rank: '8' },
      ];
      const starter = { suit: 'hearts', rank: 'K' };
      expect(countNobs(hand, starter)).toBe(1);
    });

    it('returns 0 when no Jack', () => {
      const hand = [
        { suit: 'hearts', rank: '5' },
        { suit: 'clubs', rank: '6' },
        { suit: 'spades', rank: '7' },
        { suit: 'diamonds', rank: '8' },
      ];
      const starter = { suit: 'hearts', rank: 'K' };
      expect(countNobs(hand, starter)).toBe(0);
    });

    it('returns 0 when Jack does not match starter suit', () => {
      const hand = [
        { suit: 'hearts', rank: 'J' },
        { suit: 'clubs', rank: '6' },
        { suit: 'spades', rank: '7' },
        { suit: 'diamonds', rank: '8' },
      ];
      const starter = { suit: 'clubs', rank: 'K' };
      expect(countNobs(hand, starter)).toBe(0);
    });
  });

  describe('calculateHandScore', () => {
    it('calculates a perfect 29 hand', () => {
      const hand = [
        { suit: 'hearts', rank: '5' },
        { suit: 'hearts', rank: 'J' },
        { suit: 'spades', rank: '5' },
        { suit: 'diamonds', rank: '5' },
      ];
      const starter = { suit: 'hearts', rank: '5' };
      // Perfect 29: 4x(5+J=15) = 8 pts, 4x(5+5+5=15) = 8 pts = 16 pts fifteens
      // Plus 6 pairs from 4 5s = 12 pts, plus J♥ matches starter 5♥ suit = 1 pt nobs
      // Total: 16 + 12 + 1 = 29 pts
      expect(calculateHandScore(hand, starter, false)).toBe(29);
    });

    it('calculates a simple hand', () => {
      const hand = [
        { suit: 'hearts', rank: '5' },
        { suit: 'clubs', rank: '10' },
        { suit: 'spades', rank: 'K' },
        { suit: 'diamonds', rank: 'Q' },
      ];
      const starter = { suit: 'hearts', rank: 'J' };
      // 5+10=15, 5+J=15, 5+Q=15, 5+K=15 = 8 pts, plus 10-J-Q-K run = 4 pts = 12 total
      expect(calculateHandScore(hand, starter, false)).toBe(12);
    });
  });
});
