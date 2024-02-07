import {
  padLeadingZeros,
} from '../../src/helpers/string';
import { it, describe, expect } from "vitest";

describe('String helpers', () => {
  const date = new Date();

  it('padLeadingZeros', () => {
    expect(padLeadingZeros(123, 5)).toBe('00123');
    expect(padLeadingZeros('123', 5)).toBe('00123');
    expect(padLeadingZeros('123', 0)).toBe('123');
    expect(padLeadingZeros(undefined, 5)).toBe('00000');
    expect(padLeadingZeros(null, 5)).toBe('00000');
    expect(padLeadingZeros(NaN, 5)).toBe('00000');
    expect(padLeadingZeros(undefined, undefined)).toBe('');
    expect(padLeadingZeros(null, null)).toBe('');
    expect(padLeadingZeros(NaN, NaN)).toBe('');
  });
});
