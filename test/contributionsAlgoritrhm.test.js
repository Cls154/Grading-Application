import { describe, it, expect } from 'vitest';
import { calculateMean, calculateStandardDeviation, calculateContributions } from '../utils/contributionsAlgorithm';

describe('calculate mean', () => {
  it('calculates the mean correctly', () => {
    expect(calculateMean([5, 5, 5, 5])).toBe(5);
    expect(calculateMean([1, 2, 3, 4, 5])).toBe(3);
    expect(calculateMean([33, 34, 33])).toBeCloseTo(33.33, 2);
  });
});

describe("calculateStandardDeviation", () => {
  it("calculates the standard deviation correctly", () => {
    expect(calculateStandardDeviation([1, 2, 3, 4, 5], 3)).toBeCloseTo(1.414, 3);
    expect(calculateStandardDeviation([10, 20, 30], 20)).toBeCloseTo(8.165, 3);
    expect(calculateStandardDeviation([5, 5, 5, 5], 5)).toBe(0);
  });
});

describe('calculateContributions', () => {
  it('calculates contributions and flags outliers correctly', () => {
    const peerEvaluations = [
      { 2: { 1: 33, 2: 34, 3: 33 } },
      { 1: { 1: 34, 2: 33, 3: 33 } },
      { 3: { 1: 33, 2: 33, 3: 34 } },
    ];

    const result = calculateContributions(peerEvaluations);

    expect(result).toEqual({
      outliers: {},
      overallContributions: {
        1: 33,  // (33+34+33)/3 = 33.33 ≈ 33
        2: 33,  // (34+33+33)/3 = 33.33 ≈ 33
        3: 33   // (33+33+34)/3 = 33.33 ≈ 33
      }
    });
  });

  it("handles an empty input", () => {
    const result = calculateContributions([]);
    expect(result).toEqual({ outliers: {}, overallContributions: {} });
  });

  it("flags outliers if one evaluator gives a very different score", () => {
    const peerEvaluations = [
      { 2: { 1: 100, 2: 34, 3: 33 } },  // 100 is a clear outlier for student 1
      { 1: { 1: 34, 2: 33, 3: 33 } },
      { 3: { 1: 33, 2: 33, 3: 34 } }
    ];

    const result = calculateContributions(peerEvaluations);

    expect(result.outliers).toEqual({
      2: { 1: 100 }
    });
  });

  it("handles all identical scores (no outliers)", () => {
    const peerEvaluations = [
      { 2: { 1: 33, 2: 33, 3: 33 } },
      { 1: { 1: 33, 2: 33, 3: 33 } },
      { 3: { 1: 33, 2: 33, 3: 33 } }
    ];

    const result = calculateContributions(peerEvaluations);

    expect(result).toEqual({
      outliers: {},
      overallContributions: { 1: 33, 2: 33, 3: 33 }
    });
  });
});