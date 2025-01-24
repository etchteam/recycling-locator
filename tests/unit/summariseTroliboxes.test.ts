import { expect, test } from 'vitest';

import { mockContainers, mockTroliboxes } from '../mocks/containers';
import { summariseTroliboxes } from '@/lib/summariseTroliboxes';

const formattedTroliboxes = {
  'Trolibox - Bottom box': {
    bodyColour: '#ffffff00',
    lidColour: null,
  },
  'Trolibox - Middle box': {
    bodyColour: '#4f4f4f',
    lidColour: '#2262b9',
  },
  'Trolibox - Top box': {
    bodyColour: '#4f4f4f',
    lidColour: '#56ccf2',
  },
};

test('Returns empty values for an empty container array', () => {
  expect(summariseTroliboxes([])).toEqual({ troliboxColors: {}, other: [] });
});

test('Returns empty trolibox object when none exist', () => {
  expect(summariseTroliboxes(mockContainers)).toEqual({
    troliboxColors: {},
    other: mockContainers,
  });
});

test('Returns formatted troliboxes seperated from the rest of the array', () => {
  expect(summariseTroliboxes([...mockContainers, ...mockTroliboxes])).toEqual({
    troliboxColors: formattedTroliboxes,
    other: mockContainers,
  });
});

test('Returns empty other containers array when none exist', () => {
  expect(summariseTroliboxes(mockTroliboxes)).toEqual({
    troliboxColors: formattedTroliboxes,
    other: [],
  });
});
