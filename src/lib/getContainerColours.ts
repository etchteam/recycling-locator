import { ContainerName } from '@/types/locatorApi';

import { TrolibocsMap } from './getTrolibocsColours';

const getPositionColours = (
  position: string,
  lidColour: string,
  bodyColour: string,
) => ({
  [`--lid-${position}-colour`]: lidColour,
  [`--body-${position}-colour`]: bodyColour,
});

export default function getContainerColours(
  name: ContainerName,
  bodyColour?: string,
  lidColour?: string,
  colours?: { [key: string]: { [key: string]: string } },
) {
  if (name === 'Trolibocs – 3 containers') {
    const cssColours = {};
    TrolibocsMap.forEach((position, key) => {
      Object.assign(
        cssColours,
        getPositionColours(
          position,
          colours[key]['lidColour'] ?? 'transparent',
          colours[key]['bodyColour'],
        ),
      );
    });
    return cssColours;
  }
  if (TrolibocsMap.has(name)) {
    return getPositionColours(
      TrolibocsMap.get(name),
      lidColour ?? 'transparent',
      bodyColour,
    );
  }

  return {
    '--lid-colour': lidColour ?? 'transparent',
    '--body-colour': bodyColour,
  };
}
