import { expect, test } from 'vitest';

import { summariseTroliboxes } from '@/lib/summariseTroliboxes';
import { Container } from '@/types/locatorApi';

const mockContainers: Container[] = [
  {
    name: 'Wheeled Bin',
    displayName: 'Wheeled Bin (140L)',
    bodyColour: '#3cb848',
    lidColour: '#3cb848',
    notes: [],
    materials: [
      {
        id: '91',
        name: 'Weeds',
        popular: false,
        category: {
          id: '14',
          name: 'Garden waste',
          popular: false,
          materials: [],
        },
      },
      {
        id: '92',
        name: 'Christmas trees',
        popular: false,
        category: {
          id: '14',
          name: 'Garden waste',
          popular: false,
          materials: [],
        },
      },
    ],
    cost: 31,
  },
  {
    name: 'Reusable Sack',
    displayName: 'Reusable Sack',
    bodyColour: '#3cb848',
    lidColour: null,
    notes: [],
    materials: [
      {
        id: '86',
        name: 'Flowers',
        popular: false,
        category: {
          id: '14',
          name: 'Garden waste',
          popular: false,
          materials: [],
        },
      },
      {
        id: '87',
        name: 'Grass cuttings',
        popular: false,
        category: {
          id: '14',
          name: 'Garden waste',
          popular: false,
          materials: [],
        },
      },
    ],
    cost: 31,
  },
];

const mockTroliboxes: Container[] = [
  {
    name: 'Trolibox - Top box',
    displayName: 'Trolibox - Top box',
    bodyColour: '#4f4f4f',
    lidColour: '#56ccf2',
    notes: [],
    materials: [
      {
        id: '4',
        name: 'Cereal boxes',
        popular: false,
        category: {
          id: '1',
          name: 'Cardboard',
          popular: false,
          materials: [],
        },
      },
      {
        id: '1',
        name: 'Cardboard egg boxes',
        popular: false,
        category: {
          id: '1',
          name: 'Cardboard',
          popular: false,
          materials: [],
        },
      },
      {
        id: '5',
        name: 'Corrugated cardboard',
        popular: false,
        category: {
          id: '1',
          name: 'Cardboard',
          popular: false,
          materials: [],
        },
      },
      {
        id: '7',
        name: 'Toilet roll tubes',
        popular: false,
        category: {
          id: '1',
          name: 'Cardboard',
          popular: false,
          materials: [],
        },
      },
      {
        id: '3',
        name: 'Cardboard sleeves',
        popular: false,
        category: {
          id: '1',
          name: 'Cardboard',
          popular: false,
          materials: [],
        },
      },
      {
        id: '2',
        name: 'Cardboard fruit and veg punnets',
        popular: false,
        category: {
          id: '1',
          name: 'Cardboard',
          popular: false,
          materials: [],
        },
      },
    ],
  },
  {
    name: 'Trolibox - Middle box',
    displayName: 'Trolibox - Middle box',
    bodyColour: '#4f4f4f',
    lidColour: '#2262b9',
    notes: [],
    materials: [
      {
        id: '12',
        name: 'Newspapers',
        popular: false,
        category: {
          id: '2',
          name: 'Paper',
          popular: false,
          materials: [],
        },
      },
      {
        id: '9',
        name: 'Brown envelopes',
        popular: false,
        category: {
          id: '2',
          name: 'Paper',
          popular: false,
          materials: [],
        },
      },
      {
        id: '14',
        name: 'Telephone directories',
        popular: false,
        category: {
          id: '2',
          name: 'Paper',
          popular: false,
          materials: [],
        },
      },
    ],
  },
  {
    name: 'Trolibox - Bottom box',
    displayName: 'Trolibox - Bottom box',
    bodyColour: '#ffffff00',
    lidColour: null,
    notes: [],
    materials: [
      {
        id: '62',
        name: 'Hi-fi',
        popular: false,
        category: {
          id: '10',
          name: 'Electricals',
          popular: false,
          materials: [],
        },
      },
      {
        id: '52',
        name: 'Clothing',
        popular: true,
        category: {
          id: '9',
          name: 'Textiles',
          popular: false,
          materials: [],
        },
      },
    ],
  },
];

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
