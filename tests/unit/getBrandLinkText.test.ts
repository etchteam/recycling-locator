import { describe, expect, test } from 'vitest';

import getBrandLinkText from '@/lib/getBrandLinkText';

describe('getBrandLinkText', () => {
  test('returns the hostname without www', () => {
    expect(getBrandLinkText('https://www.ecover.com/refill?a=1')).toBe(
      'ecover.com',
    );
  });

  test('keeps other subdomains', () => {
    expect(getBrandLinkText('https://uk.ecover.com/')).toBe('uk.ecover.com');
  });

  test('returns the input when it is not a valid url', () => {
    expect(getBrandLinkText('ecover.com')).toBe('ecover.com');
  });
});
