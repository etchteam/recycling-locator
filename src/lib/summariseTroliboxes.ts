import { groupBy } from 'lodash';

import { Container } from '@/types/locatorApi';

export const TroliboxMap = {
  'Trolibox - Top box': 'top',
  'Trolibox - Middle box': 'middle',
  'Trolibox - Bottom box': 'bottom',
};

export function summariseTroliboxes(containers: Container[]) {
  const splitTroliboxes = groupBy(containers, (container) =>
    Object.keys(TroliboxMap).includes(container.name) ? 'trolibox' : 'other',
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
  return { troliboxColors, other: splitTroliboxes.other ?? [] };
}
