import uniqueId from 'lodash/uniqueId';
import { useTranslation } from 'react-i18next';

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

  const { trolibocsColours, otherContainers } = getTrolibocsColours(containers);
  const completeTrolibocs = Object.keys(trolibocsColours).length === 3;
  const limitWithoutTrolibocs = completeTrolibocs ? limit - 1 : limit;

  const firstContainers = otherContainers.slice(0, limitWithoutTrolibocs);
  const remainingContainers = otherContainers.slice(limitWithoutTrolibocs);

  return (
    <ul role="list" className="list-style-none evg-spacing-bottom-md">
      {completeTrolibocs ? (
        <li key={'Trolibocs'} className="evg-spacing-bottom-sm">
          <locator-container>
            <locator-container-icon>
              <ContainerSvg
                name={t('components.schemeContainerSummary.combinedTrolibocs')}
                colours={trolibocsColours}
              />
            </locator-container-icon>
            <locator-container-content>
              <locator-container-name>
                {t('components.schemeContainerSummary.combinedTrolibocs')}
              </locator-container-name>
            </locator-container-content>
          </locator-container>
        </li>
      ) : null}
      {firstContainers.map((container) => (
        <li key={uniqueId(container.name)} className="evg-spacing-bottom-sm">
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
