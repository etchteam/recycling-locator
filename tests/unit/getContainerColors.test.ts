import { expect, test } from 'vitest';

import getContainerColours from '@/lib/getContainerColours';

const formattedTrolibocs = {
  'Trolibocs - Top box': {
    bodyColour: '#4f4f4f',
    lidColour: '#56ccf2',
  },
  'Trolibocs - Middle box': {
    bodyColour: '#4f4f4f',
    lidColour: '#2262b9',
  },
  'Trolibocs - Bottom box': {
    bodyColour: '#ffffff00',
    lidColour: null,
  },
};

test('Returns formatted cssVariables for simple container', () => {
  expect(getContainerColours('Box', 'blue')).toEqual({
    '--lid-colour': 'transparent',
    '--body-colour': 'blue',
  });

  expect(getContainerColours('Box', 'blue', 'orange')).toEqual({
    '--lid-colour': 'orange',
    '--body-colour': 'blue',
  });
});

test('Returns simple formatted cssVariables for plain trolibocs', () => {
  expect(getContainerColours('Trolibocs', 'blue')).toEqual({
    '--lid-colour': 'transparent',
    '--body-colour': 'blue',
  });
});

test('Returns formatted cssVariables for tiered trolibocs', () => {
  expect(getContainerColours('Trolibocs - Top box', 'blue', 'green')).toEqual({
    '--body-top-colour': 'blue',
    '--lid-top-colour': 'green',
  });

  expect(
    getContainerColours('Trolibocs - Middle box', 'blue', 'green'),
  ).toEqual({
    '--body-middle-colour': 'blue',
    '--lid-middle-colour': 'green',
  });

  expect(
    getContainerColours('Trolibocs - Bottom box', 'blue', 'green'),
  ).toEqual({
    '--body-bottom-colour': 'blue',
    '--lid-bottom-colour': 'green',
  });
});

test('Returns formatted cssVariables for multicoloured trolibocs', () => {
  expect(
    getContainerColours(
      'Trolibocs – 3 containers',
      null,
      null,
      formattedTrolibocs,
    ),
  ).toEqual({
    '--lid-top-colour': '#56ccf2',
    '--body-top-colour': '#4f4f4f',
    '--lid-middle-colour': '#2262b9',
    '--body-middle-colour': '#4f4f4f',
    '--lid-bottom-colour': 'transparent',
    '--body-bottom-colour': '#ffffff00',
  });
});
