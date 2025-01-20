import { describe, it, expect } from 'vitest';
import { langGetal } from './lang-getal';

describe('Lang Getal Tests', () => {
    it('should calculate correct lengths for single digit numbers', () => {
        expect(langGetal(8)).toBe(8);
    });

    it('should calculate correct lengths for two digit numbers', () => {
        expect(langGetal(15)).toBe(21);
        expect(langGetal(99)).toBe(189);
    });

    it('should calculate correct lengths for three digit numbers', () => {
        expect(langGetal(100)).toBe(192);
        expect(langGetal(997)).toBe(2883);
    });

    it('handles edge cases', () => {
        const testCases = [
            [8, 8],
            [15, 21],
            [99, 189],
            [100, 192],
            [997, 2883],
        ];

        testCases.forEach(([input, expected]) => {
            expect(langGetal(input)).toBe(expected);
        });
    });
});
