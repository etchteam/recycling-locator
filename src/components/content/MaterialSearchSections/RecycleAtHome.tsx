import { useTranslation, Trans } from 'react-i18next';
import { Link, useSearchParams } from 'wouter-preact';

import SchemeContainerSummary from '@/components/content/SchemeContainerSummary/SchemeContainerSummary';
import { usePostcode } from '@/hooks/PostcodeProvider';
import containerHasMaterial from '@/lib/containerHasMaterial';
import getPropertyTypeEnum from '@/lib/getPropertyTypeEnum';
import { LocalAuthority, LocalAuthorityProperty } from '@/types/locatorApi';

function ManyProperties({
  allPropertyTypes,
  propertyTypesCollectingThisMaterial,
}: {
  readonly allPropertyTypes: string[];
  readonly propertyTypesCollectingThisMaterial: string[];
}) {
  const PROPERTY_TYPE = getPropertyTypeEnum();
  const { postcode } = usePostcode();
  const tContext = 'material.recycleAtHome.manyProperties';
  const allPropertiesRecycle =
    propertyTypesCollectingThisMaterial.length === allPropertyTypes.length;
  const sortedPropertyTypes = [...allPropertyTypes]
    .sort((propertyType) =>
      propertyTypesCollectingThisMaterial.includes(propertyType) ? -1 : 1,
    )
    .filter((propertyType) => propertyType !== PROPERTY_TYPE.ALL);

  return (
    <>
      <p className="text-size-sm evg-spacing-bottom-sm">
        <Trans
          i18nKey={`${tContext}.collection${allPropertiesRecycle ? 'All' : 'Some'}`}
          components={{ bold: <strong /> }}
        />
      </p>
      <ul role="list" className="list-style-none evg-spacing-bottom-md">
        {sortedPropertyTypes.map((propertyType) => {
          const safePropertyType = encodeURIComponent(propertyType);
          const recyclable =
            propertyTypesCollectingThisMaterial.includes(propertyType);

          return (
            <li key={propertyType} className="evg-spacing-bottom-sm">
              <locator-icon-link>
                <Link
                  href={`/${postcode}/home/collection?propertyType=${safePropertyType}`}
                >
                  <locator-icon-circle>
                    <locator-icon
                      icon={recyclable ? 'tick' : 'close'}
                      color={recyclable ? 'positive' : 'negative'}
                    ></locator-icon>
                  </locator-icon-circle>
                  {propertyType}
                </Link>
              </locator-icon-link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function OneProperty({
  property,
}: {
  readonly property: LocalAuthorityProperty[];
}) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const containers = property
    .flatMap((scheme) => scheme.containers)
    .filter((container) =>
      containerHasMaterial(container, {
        materials: searchParams.get('materials'),
        category: searchParams.get('category'),
      }),
    );

  return (
    <>
      <p className="evg-text-size-body-xs evg-spacing-bottom-sm">
        {t('material.recycleAtHome.oneProperty.collection', {
          count: containers.length,
        })}
      </p>
      <SchemeContainerSummary containers={containers} />
    </>
  );
}

export default function RecycleAtHome({
  allProperties,
  propertiesCollectingThisMaterial,
  nonRecyclable,
}: {
  readonly allProperties: LocalAuthority['properties'];
  readonly propertiesCollectingThisMaterial: LocalAuthority['properties'];
  readonly nonRecyclable?: boolean;
}) {
  const PROPERTY_TYPE = getPropertyTypeEnum();
  const { postcode } = usePostcode();
  const { t } = useTranslation();
  const allPropertyTypes = Object.keys(allProperties ?? {});
  const propertyTypesCollectingThisMaterial = Object.keys(
    propertiesCollectingThisMaterial ?? {},
  );
  let type: 'oneProperty' | 'noProperties' | 'manyProperties' = 'noProperties';

  if (
    allPropertyTypes.length === 1 &&
    propertyTypesCollectingThisMaterial.length === 1
  ) {
    type = 'oneProperty';
  }

  if (
    allPropertyTypes.length > 1 &&
    propertyTypesCollectingThisMaterial.length >= 1
  ) {
    if (
      allPropertyTypes.includes(PROPERTY_TYPE.ALL) &&
      allPropertyTypes.length === 2
    ) {
      // Display as one property if "All properties" is the only other property type
      type = 'oneProperty';
    } else {
      type = 'manyProperties';
    }
  }

  return (
    <evg-card radius="sm">
      <evg-card-content>
        <locator-icon-text className="evg-spacing-bottom-xs">
          <locator-icon-circle
            variant={type === 'noProperties' ? 'negative' : 'positive'}
          >
            <locator-icon icon="home"></locator-icon>
          </locator-icon-circle>
          <h3>
            {t(
              `material.recycleAtHome.${type}.${nonRecyclable ? 'titleDisposal' : 'title'}`,
            )}
          </h3>
        </locator-icon-text>

        {type === 'noProperties' && (
          <p className="evg-text-size-body-xs evg-spacing-bottom-sm">
            {t('material.recycleAtHome.noProperties.content')}
          </p>
        )}

        {type === 'oneProperty' && (
          <OneProperty
            property={
              propertiesCollectingThisMaterial[PROPERTY_TYPE.ALL] ??
              propertiesCollectingThisMaterial[
                propertyTypesCollectingThisMaterial[0]
              ]
            }
          />
        )}

        {type === 'manyProperties' && (
          <ManyProperties
            allPropertyTypes={allPropertyTypes}
            propertyTypesCollectingThisMaterial={
              propertyTypesCollectingThisMaterial
            }
          />
        )}

        <evg-button width="full-width">
          <Link href={`/${postcode}/home`}>
            {t(`material.recycleAtHome.cta`)}
          </Link>
        </evg-button>
      </evg-card-content>
    </evg-card>
  );
}
