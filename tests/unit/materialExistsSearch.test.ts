import { describe, expect, test, vi } from 'vitest';

import materialExistsSearch from '@/lib/materialExistsSearch';

vi.mock('@/lib/LocatorApi', () => {
  const mockPost = vi.fn();

  return {
    default: {
      getInstance: () => ({
        post: mockPost,
      }),
    },
    mockPost,
  };
});

vi.mock('@/lib/sentry', () => ({
  captureException: vi.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { mockPost } = await import('@/lib/LocatorApi' as any);

describe('materialExistsSearch', () => {
  test('returns true when the search term matches a material name', async () => {
    mockPost.mockResolvedValueOnce([
      { id: 52, name: 'Clothing', type: 'LocatorMaterial' },
    ]);

    const result = await materialExistsSearch('Clothing');
    expect(result).toBe(true);
  });

  test('returns false when no materials match', async () => {
    mockPost.mockResolvedValueOnce([
      { id: 52, name: 'Clothing', type: 'LocatorMaterial' },
    ]);

    const result = await materialExistsSearch('Batteries');
    expect(result).toBe(false);
  });

  test('returns false when the API returns an empty list', async () => {
    mockPost.mockResolvedValueOnce([]);

    const result = await materialExistsSearch('Nonexistent');
    expect(result).toBe(false);
  });

  test('returns false when the API rejects (e.g. 400 error)', async () => {
    mockPost.mockRejectedValueOnce(new Error('Request failed with status code 400'));

    const result = await materialExistsSearch('test');
    expect(result).toBe(false);
  });
});
