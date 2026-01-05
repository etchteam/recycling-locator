import DoorstepCollection from '@/components/content/MaterialSearchSections/DoorstepCollection';
import HazardousWarning from '@/components/content/MaterialSearchSections/HazardousWarning';
import MaterialSearchSection from '@/components/content/MaterialSearchSections/MaterialSearchSection';
import NearbyPlaces from '@/components/content/MaterialSearchSections/NearbyPlaces';
import RecycleAtHome from '@/components/content/MaterialSearchSections/RecycleAtHome';
import type { UseDataState } from '@/hooks/useData';
import type {
  DoorstepCollection as DoorstepCollectionType,
  LocalAuthority,
  LocationsResponse,
  Material,
} from '@/types/locatorApi';

type SectionKey =
  | 'doorstepCollection'
  | 'hazardousWarning'
  | 'recycleAtHome'
  | 'nearbyPlaces';

interface MaterialSearchResultSectionsProps {
  readonly la: UseDataState<LocalAuthority>;
  readonly locations: UseDataState<LocationsResponse>;
  readonly doorstepCollections: UseDataState<DoorstepCollectionType[]>;
  readonly doorstepCollection: DoorstepCollectionType | undefined;
  readonly material: UseDataState<Material>;
  readonly propertiesCollectingThisMaterial: LocalAuthority['properties'];
  readonly hazardous: boolean;
  readonly nonRecyclable: boolean;
}

function getSortedSectionKeys(
  doorstepCollection: DoorstepCollectionType | undefined,
  propertiesCollectingThisMaterial: LocalAuthority['properties'],
  hazardous: boolean,
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
}: MaterialSearchResultSectionsProps) {
  const sections = new Map<SectionKey, preact.JSX.Element>();
  const sortedSectionKeys = getSortedSectionKeys(
    doorstepCollection,
    propertiesCollectingThisMaterial,
    hazardous,
  );

  if (doorstepCollection) {
    sections.set(
      'doorstepCollection',
      <MaterialSearchSection
        result={doorstepCollections}
        showLoadingCard={false}
      >
        <DoorstepCollection
          collection={doorstepCollection}
          material={material?.data}
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
      />
    </MaterialSearchSection>,
  );

  sections.set(
    'nearbyPlaces',
    <MaterialSearchSection result={locations}>
      <NearbyPlaces locations={locations?.data} nonRecyclable={nonRecyclable} />
    </MaterialSearchSection>,
  );

  return (
    <>
      {sortedSectionKeys.map((sectionKey) => (
        <div key={sectionKey} className="diamond-spacing-bottom-lg">
          {sections.get(sectionKey)}
        </div>
      ))}
    </>
  );
}
