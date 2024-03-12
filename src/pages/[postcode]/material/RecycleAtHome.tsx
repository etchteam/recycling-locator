import { useTranslation, Trans } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import '@etchteam/diamond-ui/canvas/Card/Card';
import '@etchteam/diamond-ui/composition/Grid/Grid';
import '@etchteam/diamond-ui/composition/Grid/GridItem';
import '@etchteam/diamond-ui/control/Button/Button';

import '@/components/canvas/IconCircle/IconCircle';
import '@/components/composition/IconText/IconText';
import '@/components/composition/BorderedList/BorderedList';
import '@/components/control/IconLink/IconLink';
import '@/components/content/Icon/Icon';
import '@/components/content/Container/Container';

import SchemeContainerSummary from '@/components/template/SchemeContainerSummary/SchemeContainerSummary';
import getPropertyDisplayName from '@/lib/getPropertyDisplayName';
import {
  LocalAuthority,
  LocalAuthorityProperty,
  PROPERTY_TYPE,
} from '@/types/locatorApi';

function ManyProperties({
  allProperties,
  allPropertyTypes,
  propertyTypesCollectingThisMaterial,
}: {
  readonly allProperties: LocalAuthority['properties'];
  readonly allPropertyTypes: string[];
  readonly propertyTypesCollectingThisMaterial: string[];
}) {
  const { postcode } = useParams();
  const tContext = 'material.recycleAtHome.manyProperties';
  const allPropertiesRecycle =
    propertyTypesCollectingThisMaterial.length === allPropertyTypes.length;
  const sortedPropertyTypes = allPropertyTypes
    .toSorted((propertyType) =>
      propertyTypesCollectingThisMaterial.includes(propertyType) ? -1 : 1,
    )
    .filter((propertyType) => propertyType !== PROPERTY_TYPE.ALL);

  return (
    <>
      <p className="text-size-sm">
        <Trans
          i18nKey={`${tContext}.collection${allPropertiesRecycle ? 'All' : 'Some'}`}
          components={{ bold: <strong /> }}
        />
      </p>
      <ul role="list" className="list-style-none diamond-spacing-bottom-md">
        {sortedPropertyTypes.map((propertyType) => {
          const safePropertyType = encodeURIComponent(propertyType);
          const recyclable =
            propertyTypesCollectingThisMaterial.includes(propertyType);

          return (
            <li key={propertyType} className="diamond-spacing-bottom-sm">
              <locator-icon-link>
                <Link
                  to={`/${postcode}/home/collection?propertyType=${safePropertyType}`}
                >
                  <locator-icon-circle>
                    <locator-icon
                      icon={recyclable ? 'tick' : 'close'}
                      color={recyclable ? 'positive' : 'negative'}
                    ></locator-icon>
                  </locator-icon-circle>
                  {getPropertyDisplayName(allProperties[propertyType])}
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
  materialId,
  property,
}: {
  readonly materialId: number;
  readonly property: LocalAuthorityProperty[];
}) {
  const { t } = useTranslation();
  const containers = property
    .flatMap((scheme) => scheme.containers)
    .filter((container) =>
      container.materials?.some((material) => material.id === materialId),
    );

  return (
    <>
      <p className="diamond-text-size-sm">
        {t('material.recycleAtHome.oneProperty.collection', {
          count: containers.length,
        })}
      </p>
      <SchemeContainerSummary containers={containers} />
    </>
  );
}

export default function RecycleAtHome({
  materialId,
  allProperties,
  propertiesCollectingThisMaterial,
}: {
  readonly materialId: number;
  readonly allProperties: LocalAuthority['properties'];
  readonly propertiesCollectingThisMaterial: LocalAuthority['properties'];
}) {
  const { postcode } = useParams();
  const { t } = useTranslation();
  const allPropertyTypes = Object.keys(allProperties);
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
    <diamond-card border radius>
      <locator-icon-text className="diamond-spacing-bottom-xs">
        <locator-icon-circle
          variant={type === 'noProperties' ? 'negative' : 'positive'}
        >
          <locator-icon icon="home"></locator-icon>
        </locator-icon-circle>
        <h3>{t(`material.recycleAtHome.${type}.title`)}</h3>
      </locator-icon-text>

      {type === 'noProperties' && (
        <p className="diamond-text-size-sm">
          {t('material.recycleAtHome.noProperties.content')}
        </p>
      )}

      {type === 'oneProperty' && (
        <OneProperty
          materialId={materialId}
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
          allProperties={allProperties}
          allPropertyTypes={allPropertyTypes}
          propertyTypesCollectingThisMaterial={
            propertyTypesCollectingThisMaterial
          }
        />
      )}

      <diamond-button width="full-width">
        <Link to={`/${postcode}/home`}>{t(`material.recycleAtHome.cta`)}</Link>
      </diamond-button>
    </diamond-card>
  );
}