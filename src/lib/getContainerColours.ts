import { ContainerName } from '@/types/locatorApi';

import { TrolibocsMap } from './getTrolibocsColours';

const getPositionColours = (
  position: string,
  lidColor: string,
  bodyColor: string,
) => ({
  [`--lid-${position}-colour`]: lidColor,
  [`--body-${position}-colour`]: bodyColor,
});

export default function getContainerColours(
  name: ContainerName,
  bodyColour?: string,
  lidColour?: string,
  colors?: { [key: string]: { [key: string]: string } },
) {
  if (name === 'Trolibocs – 3 containers') {
    const cssColors = {};
    TrolibocsMap.forEach((position, key) => {
      Object.assign(
        cssColors,
        getPositionColours(
          position,
          colors[key]['lidColour'] ?? 'transparent',
          colors[key]['bodyColour'],
        ),
      );
    });
    return cssColors;
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
