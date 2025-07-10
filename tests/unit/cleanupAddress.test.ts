import { describe, expect, test } from 'vitest';

import cleanupAddress from '@/lib/cleanupAddress';

describe('cleanupAddress', () => {
  test('trims whitespace and capitalizes each word', () => {
    expect(cleanupAddress('  123 main street  ')).toBe('123 Main Street');
    expect(cleanupAddress('flat 2, 123 main street')).toBe(
      'Flat 2, 123 Main Street',
    );
  });

  test('handles multiple commas and trims lines', () => {
    expect(cleanupAddress('Flat 2,, 123 main street')).toBe(
      'Flat 2, 123 Main Street',
    );
    expect(cleanupAddress('Flat 2, , 123 main street')).toBe(
      'Flat 2, 123 Main Street',
    );
  });

  test('preserves postcode formatting and casing', () => {
    expect(cleanupAddress('Flat 2, 123 main street, EH11 2JY')).toBe(
      'Flat 2, 123 Main Street, EH11 2JY',
    );
    expect(cleanupAddress('Flat 2, 123 main street, eh11 2jy')).toBe(
      'Flat 2, 123 Main Street, eh11 2jy',
    );
    expect(cleanupAddress('Flat 2, 123 main street, EH112JY')).toBe(
      'Flat 2, 123 Main Street, EH112JY',
    );
  });

  test('handles addresses with only a postcode', () => {
    expect(cleanupAddress('EH11 2JY')).toBe('EH11 2JY');
    expect(cleanupAddress('eh11 2jy')).toBe('eh11 2jy');
  });

  test('handles empty and whitespace-only input', () => {
    expect(cleanupAddress('')).toBe('');
    expect(cleanupAddress('   ')).toBe('');
  });

  test('handles addresses with numbers and mixed casing', () => {
    expect(cleanupAddress('1a lower high street')).toBe('1a Lower High Street');
    expect(cleanupAddress('THE OLD SCHOOL, 1A LOWER HIGH STREET')).toBe(
      'The Old School, 1a Lower High Street',
    );
  });

  test('does not add extra spaces after commas', () => {
    expect(cleanupAddress('Flat 2,123 main street')).toBe(
      'Flat 2, 123 Main Street',
    );
  });
});
