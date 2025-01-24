import groupBy from 'lodash/groupBy';

import { Container } from '@/types/locatorApi';

export const TroliboxMap = new Map<string, string>([
  ['Trolibox - Top box', 'top'],
  ['Trolibox - Middle box', 'middle'],
  ['Trolibox - Bottom box', 'bottom'],
]);

export function getTrolibocsColours(containers: Container[]) {
  const splitTroliboxes = groupBy(containers, (container) =>
    TroliboxMap.has(container.name) ? 'trolibox' : 'otherContainers',
  );

  const troliboxColors = Object.fromEntries(
    (splitTroliboxes.trolibox ?? []).map((container) => [
      container.name,
      {
        bodyColour: container.bodyColour,
        lidColour: container.lidColour,
      },
    ]),
  );
  return {
    troliboxColors,
    otherContainers: splitTroliboxes.otherContainers ?? [],
  };
}
