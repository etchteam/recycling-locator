import groupBy from 'lodash/groupBy';
import nl2br from 'nl2br';
import { Trans, useTranslation } from 'react-i18next';
import '@etchteam/diamond-ui/canvas/Card/Card';
import '@etchteam/diamond-ui/composition/Enter/Enter';

import '@/components/canvas/IconCircle/IconCircle';
import '@/components/composition/IconText/IconText';
import '@/components/content/Container/Container';
import '@/components/content/Icon/Icon';
import '@/components/control/Details/Details';
import ContainerSVG from '@/components/content/Container/ContainerSVG';
import MaterialSearchBanner from '@/components/content/MaterialSearchBanner/MaterialSearchBanner';
import containerName from '@/lib/containerName';
import {
  ContainerList as ContainerListType,
  searchContainerList,
} from '@/lib/getContainerList';
import { Container, LocalAuthority } from '@/types/locatorApi';

function ContainerNotes({
  container,
  flush,
}: {
  readonly container: Container;
  readonly flush?: boolean;
}) {
  const { t } = useTranslation();

  if (!container.notes || container.notes?.length === 0) {
    return null;
  }

  return (
    <locator-details
      className="diamond-spacing-top-sm diamond-spacing-bottom-sm"
      flush={flush}
    >
      <details>
        <summary>
          <locator-details-summary-content>
            <span className="diamond-text-size-sm">
              {t('components.container.notes')}
            </span>
            <locator-details-summary-preview>
              {container.notes}
            </locator-details-summary-preview>
          </locator-details-summary-content>
          <locator-icon icon="expand" />
        </summary>
        <p
          className="diamond-text-size-sm"
          dangerouslySetInnerHTML={{
            __html: nl2br(container.notes.join('\n\n')),
          }}
        />
      </details>
    </locator-details>
  );
}

function DryContainer({ container }: { readonly container: Container }) {
  const materialCategories = groupBy(container.materials, 'category.name');

  return (
    <>
      <locator-container className="diamond-spacing-bottom-sm">
        <locator-container-icon>
          <ContainerSVG
            name={container.name}
            bodyColour={container.bodyColour}
            lidColour={container.lidColour}
          />
        </locator-container-icon>
        <locator-container-content>
          <locator-container-name className="diamond-text-weight-bold">
            {containerName(container)}
          </locator-container-name>
        </locator-container-content>
      </locator-container>
      {Object.keys(materialCategories)?.map((category) => (
        <locator-details key={category} className="diamond-spacing-bottom-sm">
          <details>
            <summary>
              {category}
              <locator-icon icon="expand" />
            </summary>
            <ul className="diamond-text-size-sm">
              {materialCategories[category].map((material) => (
                <li key={material.name}>{material.name}</li>
              ))}
            </ul>
          </details>
        </locator-details>
      ))}
      <ContainerNotes container={container} />
    </>
  );
}

function FoodAndGardenContainers({
  localAuthority,
  containerList,
}: {
  readonly localAuthority: LocalAuthority;
  readonly containerList: ContainerListType;
}) {
  const { t } = useTranslation();
  const hasGardenSubscription = containerList.Garden?.some(
    (container) => container.cost && container.cost > 0,
  );

  return (
    <>
      {['Food', 'Garden'].map((streamType) => {
        if (!containerList[streamType]) {
          return null;
        }

        const icon = streamType.toLowerCase() as 'food' | 'garden';

        return (
          <diamond-card
            className="diamond-spacing-bottom-lg"
            key={streamType}
            border
            radius
          >
            <locator-icon-text className="diamond-spacing-bottom-sm">
              <locator-icon-circle variant="primary">
                <locator-icon icon={icon} />
              </locator-icon-circle>
              <h4>{streamType}</h4>
            </locator-icon-text>
            <div className="diamond-text-size-sm diamond-spacing-bottom-sm">
              <p>{t(`homeRecycling.collection.collected${streamType}Items`)}</p>
              <ul>
                {containerList[streamType][0].materials.map((material) => (
                  <li key={material.name}>{material.name}</li>
                ))}
              </ul>
              <p>{t(`homeRecycling.collection.binsInYourArea`)}</p>
            </div>
            <ul
              role="list"
              className="list-style-none diamond-spacing-bottom-md"
            >
              {containerList[streamType].map((container) => (
                <li key={container.name} className="diamond-spacing-bottom-md">
                  <locator-container>
                    <locator-container-icon>
                      <ContainerSVG
                        name={container.name}
                        bodyColour={container.bodyColour}
                        lidColour={container.lidColour}
                      />
                    </locator-container-icon>
                    <locator-container-content>
                      <locator-container-name className="diamond-text-weight-bold">
                        {containerName({
                          displayName: container.name,
                          bodyColour: container.bodyColour,
                          lidColour: container.lidColour,
                        })}
                      </locator-container-name>
                    </locator-container-content>
                  </locator-container>
                  <ContainerNotes container={container} flush />
                </li>
              ))}
            </ul>
            {streamType === 'Garden' && hasGardenSubscription && (
              <>
                <hr className="diamond-spacing-bottom-sm" />
                <p className="diamond-text-size-sm">
                  <Trans
                    i18nKey={'homeRecycling.collection.gardenSubscription'}
                    components={{ bold: <strong /> }}
                  />
                </p>
                {localAuthority.gardenWasteUri && (
                  <diamond-button width="full-width" size="sm">
                    <a
                      href={localAuthority.gardenWasteUri}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {localAuthority.name}
                      <locator-icon icon="external"></locator-icon>
                    </a>
                  </diamond-button>
                )}
              </>
            )}
          </diamond-card>
        );
      })}
    </>
  );
}

export default function ContainerList({
  localAuthority,
  containerList: originalContainerList,
  search,
}: {
  readonly localAuthority: LocalAuthority;
  readonly containerList: ContainerListType;
  readonly search: string;
}) {
  const { t } = useTranslation();
  const { containerList, containerCount, searchResult } = searchContainerList(
    originalContainerList,
    search,
  );

  return (
    <>
      <div className="diamond-spacing-bottom-lg">
        {searchResult ? (
          <diamond-enter type="fade">
            <MaterialSearchBanner
              search={search}
              searchResult={searchResult === 'positive'}
              message={String(
                t(`homeRecycling.collection.search.${searchResult}`, {
                  count: containerCount,
                }),
              )}
            ></MaterialSearchBanner>
          </diamond-enter>
        ) : (
          <>
            {containerList.Dry?.length > 1 && (
              <p className="diamond-text-size-sm diamond-spacing-top-md">
                <strong>
                  {t('homeRecycling.collection.multipleCollectionsOperate')}
                </strong>
                <br />
                {t('homeRecycling.collection.eligibleMaterials')}
              </p>
            )}
          </>
        )}
      </div>

      {containerList.Dry?.length === 1 ? (
        <ul role="list" className="list-style-none diamond-spacing-bottom-md">
          {containerList.Dry[0].containers.map((container) => (
            <li key={container.name} className="diamond-spacing-bottom-md">
              <DryContainer container={container} />
            </li>
          ))}
        </ul>
      ) : (
        <>
          {containerList.Dry.map((scheme) => (
            <diamond-card
              className="diamond-spacing-bottom-lg"
              key={scheme.name}
              border
              radius
            >
              <locator-icon-text className="diamond-spacing-bottom-sm">
                <locator-icon-circle variant="primary">
                  <locator-icon icon="dry" />
                </locator-icon-circle>
                <h4>{scheme.name}</h4>
              </locator-icon-text>
              <p className="diamond-text-size-sm diamond-spacing-bottom-md">
                {t(`homeRecycling.collection.binsInYourArea`)}
              </p>
              <ul
                role="list"
                className="list-style-none diamond-spacing-bottom-md"
              >
                {scheme.containers.map((container) => (
                  <li
                    key={container.name}
                    className="diamond-spacing-bottom-md"
                  >
                    <DryContainer container={container} />
                  </li>
                ))}
              </ul>
            </diamond-card>
          ))}
        </>
      )}

      <FoodAndGardenContainers
        localAuthority={localAuthority}
        containerList={containerList}
      />
    </>
  );
}
