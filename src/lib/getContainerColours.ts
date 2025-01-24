import { ContainerName } from '@/types/locatorApi';

import { TroliboxMap } from './summariseTroliboxes';

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
  const positions = Object.keys(TroliboxMap);
  if (name !== 'Trolibox – 3 containers' && !positions.includes(name)) {
    return {
      '--lid-colour': lidColour ?? 'transparent',
      '--body-colour': bodyColour,
    };
  }

  if (name === 'Trolibox – 3 containers') {
    return Object.assign(
      {},
      ...positions.map((position) =>
        getPositionColours(
          TroliboxMap[position],
          colors[position]['lidColour'] ?? 'transparent',
          colors[position]['bodyColour'],
        ),
      ),
    );
  }

  return getPositionColours(
    TroliboxMap[name],
    lidColour ?? 'transparent',
    bodyColour,
  );
}
