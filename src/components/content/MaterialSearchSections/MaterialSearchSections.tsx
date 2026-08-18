import DoorstepCollection from '@/components/content/MaterialSearchSections/DoorstepCollection';
import HazardousWarning from '@/components/content/MaterialSearchSections/HazardousWarning';
import MaterialSearchSection from '@/components/content/MaterialSearchSections/MaterialSearchSection';
import NearbyPlaces from '@/components/content/MaterialSearchSections/NearbyPlaces';
import RecycleAtHome from '@/components/content/MaterialSearchSections/RecycleAtHome';
import RefillPromo from '@/components/content/RefillPromo/RefillPromo';
import type { UseDataState } from '@/hooks/useData';
import { isRefillPromoCategory } from '@/lib/refillPromoCategories';
import type {
  DoorstepCollection as DoorstepCollectionType,
  LocalAuthority,
  LocationsResponse,
  Material,
  MaterialCategory,
} from '@/types/locatorApi';

type SectionKey =
  | 'doorstepCollection'
  | 'hazardousWarning'
  | 'recycleAtHome'
  | 'nearbyPlaces'
  | 'refillPromo';

interface MaterialSearchResultSectionsProps {
  readonly la: UseDataState<LocalAuthority>;
  readonly locations: UseDataState<LocationsResponse>;
  readonly doorstepCollections: UseDataState<DoorstepCollectionType[]>;
  readonly doorstepCollection: DoorstepCollectionType | undefined;
  readonly material: UseDataState<Material>;
  readonly propertiesCollectingThisMaterial: LocalAuthority['properties'];
  readonly hazardous: boolean;
  readonly nonRecyclable: boolean;
  readonly bulky?: boolean;
  readonly refillLocations: UseDataState<LocationsResponse>;
  readonly category: UseDataState<MaterialCategory>;
}

function getSortedSectionKeys(
  doorstepCollection: DoorstepCollectionType | undefined,
  propertiesCollectingThisMaterial: LocalAuthority['properties'],
  hazardous: boolean,
  showRefillPromo: boolean,
) {
  const sortedSectionKeys: SectionKey[] = [];

  if (doorstepCollection && !propertiesCollectingThisMaterial) {
    sortedSectionKeys.push('doorstepCollection');
  }

  if (hazardous) {
    sortedSectionKeys.push('hazardousWarning');
  }

  sortedSectionKeys.push('recycleAtHome');

  if (doorstepCollection && propertiesCollectingThisMaterial) {
    sortedSectionKeys.push('doorstepCollection');
  }

  sortedSectionKeys.push('nearbyPlaces');

  if (showRefillPromo) {
    sortedSectionKeys.push('refillPromo');
  }

  return sortedSectionKeys;
}

export default function MaterialSearchSections({
  la,
  locations,
  doorstepCollections,
  doorstepCollection,
  material,
  propertiesCollectingThisMaterial,
  hazardous,
  nonRecyclable,
  bulky,
  refillLocations,
  category,
}: MaterialSearchResultSectionsProps) {
  const sections = new Map<SectionKey, preact.JSX.Element>();
  const categoryId = material.data?.category?.id ?? category.data?.id;
  const showRefillPromo = isRefillPromoCategory(categoryId);
  const sortedSectionKeys = getSortedSectionKeys(
    doorstepCollection,
    propertiesCollectingThisMaterial,
    hazardous,
    showRefillPromo,
  );

  if (doorstepCollection && material.data) {
    sections.set(
      'doorstepCollection',
      <MaterialSearchSection
        result={doorstepCollections}
        showLoadingCard={false}
      >
        <DoorstepCollection
          collection={doorstepCollection}
          material={material.data}
        />
      </MaterialSearchSection>,
    );
  }

  if (hazardous) {
    sections.set(
      'hazardousWarning',
      <MaterialSearchSection result={la} showLoadingCard={false}>
        <HazardousWarning localAuthority={la?.data} />
      </MaterialSearchSection>,
    );
  }

  sections.set(
    'recycleAtHome',
    <MaterialSearchSection result={la}>
      <RecycleAtHome
        allProperties={la?.data?.properties}
        propertiesCollectingThisMaterial={propertiesCollectingThisMaterial}
        nonRecyclable={nonRecyclable}
        bulky={bulky}
        bulkyWasteCollections={la?.data?.bulkyWaste}
      />
    </MaterialSearchSection>,
  );

  sections.set(
    'nearbyPlaces',
    <MaterialSearchSection result={locations}>
      <NearbyPlaces locations={locations?.data} nonRecyclable={nonRecyclable} />
    </MaterialSearchSection>,
  );

  if (showRefillPromo) {
    const refillCount = refillLocations?.data?.items?.length ?? 0;

    sections.set(
      'refillPromo',
      <MaterialSearchSection result={refillLocations} showLoadingCard={false}>
        {refillCount > 0 && <RefillPromo count={refillCount} />}
      </MaterialSearchSection>,
    );
  }

  return (
    <>
      {sortedSectionKeys.map((sectionKey) => (
        <div key={sectionKey} className="evg-spacing-bottom-lg">
          {sections.get(sectionKey)}
        </div>
      ))}
    </>
  );
}
