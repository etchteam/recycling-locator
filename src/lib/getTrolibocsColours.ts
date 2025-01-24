import groupBy from 'lodash/groupBy';

import { Container } from '@/types/locatorApi';

export const TrolibocsMap = new Map<string, string>([
  ['Trolibocs - Top box', 'top'],
  ['Trolibocs - Middle box', 'middle'],
  ['Trolibocs - Bottom box', 'bottom'],
]);

export function getTrolibocsColours(containers: Container[]) {
  const splitTrolibocs = groupBy(containers, (container) =>
    TrolibocsMap.has(container.name) ? 'trolibocs' : 'otherContainers',
  );

  const trolibocsColors = Object.fromEntries(
    (splitTrolibocs.trolibocs ?? []).map((container) => [
      container.name,
      {
        bodyColour: container.bodyColour,
        lidColour: container.lidColour,
      },
    ]),
  );
  return {
    trolibocsColors,
    otherContainers: splitTrolibocs.otherContainers ?? [],
  };
}
