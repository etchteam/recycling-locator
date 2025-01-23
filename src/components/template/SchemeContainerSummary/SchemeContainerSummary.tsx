import { uniqueId, groupBy } from 'lodash';
import { useTranslation } from 'react-i18next';

import '@/components/content/Container/Container';
import ContainerSvg from '@/components/content/Container/ContainerSVG';
import containerName from '@/lib/containerName';
import { Container } from '@/types/locatorApi';

const Trolibocs = [
  'Trolibox - Top box',
  'Trolibox - Middle box',
  'Trolibox - Bottom box',
];

const summariseTroliboxes = (containers: Container[]) => {
  const splitTroliboxes = groupBy(containers, (container) =>
    Trolibocs.includes(container.name) ? 'trolibox' : 'other',
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
};

export default function SchemeContainerSummary({
  containers,
  limit = 2,
}: {
  readonly containers: Container[];
  readonly limit?: number;
}) {
  const { t } = useTranslation();

  const { troliboxColors, other } = summariseTroliboxes(containers);
  const completeTrolibox = Object.keys(troliboxColors).length === 3;
  if (completeTrolibox) {
    limit = limit - 1;
  }

  const firstContainers = other.slice(0, limit);
  const remainingContainers = other.slice(limit);

  return (
    <ul role="list" className="list-style-none diamond-spacing-bottom-md">
      {completeTrolibox ? (
        <li key={'Trolibox'} className="diamond-spacing-bottom-sm">
          <locator-container>
            <locator-container-icon>
              <ContainerSvg
                name={'Trolibox – 3 containers'}
                colors={troliboxColors}
              />
            </locator-container-icon>
            <locator-container-content>
              <locator-container-name>
                Trolibox – 3 containers
              </locator-container-name>
            </locator-container-content>
          </locator-container>
        </li>
      ) : null}
      {firstContainers.map((container) => (
        <li
          key={uniqueId(container.name)}
          className="diamond-spacing-bottom-sm"
        >
          <locator-container>
            <locator-container-icon>
              <ContainerSvg
                name={container.name}
                body-colour={container.bodyColour}
                lid-colour={container.lidColour}
              />
            </locator-container-icon>
            <locator-container-content>
              <locator-container-name>
                {containerName(container)}
              </locator-container-name>
            </locator-container-content>
          </locator-container>
        </li>
      ))}
      {remainingContainers.length > 0 && (
        <li>
          {t('components.schemeContainerSummary.otherContainers', {
            count: remainingContainers.length,
          })}
        </li>
      )}
    </ul>
  );
}
