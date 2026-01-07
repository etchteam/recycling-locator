import groupBy from 'lodash/groupBy';
import nl2br from 'nl2br';
import { Trans, useTranslation } from 'react-i18next';

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
      className="evg-spacing-top-sm evg-spacing-bottom-sm"
      flush={flush}
    >
      <details>
        <summary>
          <locator-details-summary-content>
            <span className="evg-text-size-body-xs">
              {t('components.container.notes')}
            </span>
            <locator-details-summary-preview>
              {container.notes}
            </locator-details-summary-preview>
          </locator-details-summary-content>
          <locator-icon icon="expand" />
        </summary>
        <p
          className="evg-text-size-body-xs"
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
      <locator-container className="evg-spacing-bottom-sm">
        <locator-container-icon>
          <ContainerSVG
            name={container.name}
            bodyColour={container.bodyColour}
            lidColour={container.lidColour}
          />
        </locator-container-icon>
        <locator-container-content>
          <locator-container-name className="evg-text-weight-bold">
            {containerName(container)}
          </locator-container-name>
        </locator-container-content>
      </locator-container>
      {Object.keys(materialCategories)?.map((category) => (
        <locator-details key={category} className="evg-spacing-bottom-sm">
          <details>
            <summary>
              {category}
              <locator-icon icon="expand" />
            </summary>
            <ul className="evg-text-size-body-xs">
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
          <evg-card
            className="evg-spacing-bottom-lg"
            key={streamType}
            radius="sm"
          >
            <evg-card-content>
              <div>
                <locator-icon-text className="evg-spacing-bottom-sm">
                  <locator-icon-circle variant="primary">
                    <locator-icon icon={icon} />
                  </locator-icon-circle>
                  <h4>{streamType}</h4>
                </locator-icon-text>
                <div className="evg-text-size-body-xs evg-spacing-bottom-sm">
                  <p>
                    {t(`homeRecycling.collection.collected${streamType}Items`)}
                  </p>
                  <ul>
                    {containerList[streamType][0].materials.map((material) => (
                      <li key={material.name}>{material.name}</li>
                    ))}
                  </ul>
                  <p>{t(`homeRecycling.collection.binsInYourArea`)}</p>
                </div>
                <ul
                  role="list"
                  className="list-style-none evg-spacing-bottom-md"
                >
                  {containerList[streamType].map((container) => (
                    <li key={container.name} className="evg-spacing-bottom-md">
                      <locator-container>
                        <locator-container-icon>
                          <ContainerSVG
                            name={container.name}
                            bodyColour={container.bodyColour}
                            lidColour={container.lidColour}
                          />
                        </locator-container-icon>
                        <locator-container-content>
                          <locator-container-name className="evg-text-weight-bold">
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
                    <hr className="evg-spacing-bottom-sm" />
                    <p className="evg-text-size-body-xs evg-spacing-bottom-sm">
                      <Trans
                        i18nKey={'homeRecycling.collection.gardenSubscription'}
                        components={{ bold: <strong /> }}
                      />
                    </p>
                    {localAuthority.gardenWasteUri && (
                      <evg-button width="full-width" size="sm">
                        <a
                          href={localAuthority.gardenWasteUri}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {localAuthority.name}
                          <locator-icon icon="external"></locator-icon>
                        </a>
                      </evg-button>
                    )}
                  </>
                )}
              </div>
            </evg-card-content>
          </evg-card>
        );
      })}
    </>
  );
}

export default function HomeCollectionContainers({
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
      <div className="evg-spacing-bottom-lg">
        {searchResult ? (
          <evg-enter type="fade">
            <MaterialSearchBanner
              search={search}
              searchResult={searchResult === 'positive'}
              message={String(
                t(`homeRecycling.collection.search.${searchResult}`, {
                  count: containerCount,
                }),
              )}
            ></MaterialSearchBanner>
          </evg-enter>
        ) : (
          <>
            {containerList.Dry?.length > 1 && (
              <p className="evg-text-size-body-xs evg-spacing-top-md">
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
        <ul role="list" className="list-style-none evg-spacing-bottom-md">
          {containerList.Dry[0].containers.map((container) => (
            <li key={container.name} className="evg-spacing-bottom-md">
              <DryContainer container={container} />
            </li>
          ))}
        </ul>
      ) : (
        <>
          {containerList.Dry.map((scheme) => (
            <evg-card
              className="evg-spacing-bottom-lg"
              key={scheme.name}
              radius="sm"
            >
              <evg-card-content>
                <locator-icon-text className="evg-spacing-bottom-sm">
                  <locator-icon-circle variant="primary">
                    <locator-icon icon="dry" />
                  </locator-icon-circle>
                  <h4>{scheme.name}</h4>
                </locator-icon-text>
                <p className="evg-text-size-body-xs evg-spacing-bottom-md">
                  {t(`homeRecycling.collection.binsInYourArea`)}
                </p>
                <ul
                  role="list"
                  className="list-style-none evg-spacing-bottom-md"
                >
                  {scheme.containers.map((container) => (
                    <li key={container.name} className="evg-spacing-bottom-md">
                      <DryContainer container={container} />
                    </li>
                  ))}
                </ul>
              </evg-card-content>
            </evg-card>
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
