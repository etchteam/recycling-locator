import { uniqueId } from 'lodash';
import { useTranslation } from 'react-i18next';

import '@/components/content/Container/Container';
import ContainerSvg from '@/components/content/Container/ContainerSVG';
import containerName from '@/lib/containerName';
import { getTrolibocsColours } from '@/lib/getTrolibocsColours';
import { Container } from '@/types/locatorApi';

export default function SchemeContainerSummary({
  containers,
  limit = 2,
}: {
  readonly containers: Container[];
  readonly limit?: number;
}) {
  const { t } = useTranslation();

  const { troliboxColors, otherContainers } = getTrolibocsColours(containers);
  const completeTrolibox = Object.keys(troliboxColors).length === 3;
  const limitWithoutTrolibox = completeTrolibox ? limit - 1 : limit;

  const firstContainers = otherContainers.slice(0, limitWithoutTrolibox);
  const remainingContainers = otherContainers.slice(limitWithoutTrolibox);

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
                bodyColour={container.bodyColour}
                lidColour={container.lidColour}
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
