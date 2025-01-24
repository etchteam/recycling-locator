import { expect, test } from 'vitest';

import { mockContainers, mockTroliboxes } from '../mocks/containers';
import { getTrolibocsColours } from '@/lib/getTrolibocsColours';

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
  expect(getTrolibocsColours([])).toEqual({ troliboxColors: {}, other: [] });
});

test('Returns empty trolibox object when none exist', () => {
  expect(getTrolibocsColours(mockContainers)).toEqual({
    troliboxColors: {},
    other: mockContainers,
  });
});

test('Returns formatted troliboxes seperated from the rest of the array', () => {
  expect(getTrolibocsColours([...mockContainers, ...mockTroliboxes])).toEqual({
    troliboxColors: formattedTroliboxes,
    other: mockContainers,
  });
});

test('Returns empty other containers array when none exist', () => {
  expect(getTrolibocsColours(mockTroliboxes)).toEqual({
    troliboxColors: formattedTroliboxes,
    other: [],
  });
});
