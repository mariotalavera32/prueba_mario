import { describe, it, expect } from 'vitest';
import { sum, divide } from '../src/math';

describe('sum', () => {
  it('suma dos números', () => expect(sum(2, 3)).toBe(5));
  it('maneja negativos', () => expect(sum(-1, 1)).toBe(0));
});

describe('divide', () => {
  it('divide dos números', () => expect(divide(10, 2)).toBe(5));
  it('lanza error al dividir por cero', () =>
    expect(() => divide(1, 0)).toThrow('No se puede dividir por cero'));
});
