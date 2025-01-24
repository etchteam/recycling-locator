import { expect, test } from 'vitest';

import { mockContainers, mockTrolibocs } from '../mocks/containers';
import { getTrolibocsColours } from '@/lib/getTrolibocsColours';

const formattedTrolibocs = {
  'Trolibocs - Bottom box': {
    bodyColour: '#ffffff00',
    lidColour: null,
  },
  'Trolibocs - Middle box': {
    bodyColour: '#4f4f4f',
    lidColour: '#2262b9',
  },
  'Trolibocs - Top box': {
    bodyColour: '#4f4f4f',
    lidColour: '#56ccf2',
  },
};

test('Returns empty values for an empty container array', () => {
  expect(getTrolibocsColours([])).toEqual({
    trolibocsColors: {},
    otherContainers: [],
  });
});

test('Returns empty trolibocs object when none exist', () => {
  expect(getTrolibocsColours(mockContainers)).toEqual({
    trolibocsColors: {},
    otherContainers: mockContainers,
  });
});

test('Returns formatted trolibocs seperated from the rest of the array', () => {
  expect(getTrolibocsColours([...mockContainers, ...mockTrolibocs])).toEqual({
    trolibocsColors: formattedTrolibocs,
    otherContainers: mockContainers,
  });
});

test('Returns empty other containers array when none exist', () => {
  expect(getTrolibocsColours(mockTrolibocs)).toEqual({
    trolibocsColors: formattedTrolibocs,
    otherContainers: [],
  });
});
