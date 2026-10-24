import { describe, it, expect } from 'vitest';

const sum = (a: number, b: number) => a + b;

describe('sum', () => {
  it('suma dos números', () => expect(sum(2, 3)).toBe(5));
  it('maneja negativos', () => expect(sum(-1, 1)).toBe(0));
});
