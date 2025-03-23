export interface PostcodeResponse {
  error?: string;
  postcode?: string;
}

export interface MaterialSearch {
  id: string;
  name: string;
  type: 'LocatorMaterial' | 'LocatorMaterialCategory';
}

export interface Material {
  id: string;
  name: string;
  recycleType?: 'Recycle' | 'Re-use';
  nameCy?: string;
  popular?: boolean;
  valpakMaterials?: ValpakMaterial[];
  aliases?: { id: string; alias: string }[];
  meta?: RecyclingMeta[];
}

export interface ValpakMaterial {
  id: string;
  code: string;
  category?: string;
  name?: string;
}

export interface MaterialCategory {
  id: string;
  name: string;
  nameCy?: string;
  popular?: boolean;
  materials?: Material[];
}

export interface MaterialWithCategory extends Material {
  category: MaterialCategory;
}

export type ContainerName =
  | 'Box'
  | 'Communal Wheeled Bin'
  | 'Inner Caddy'
  | 'Kerbside Caddy'
  | 'Kitchen Caddy'
  | 'Reusable Sack'
  | 'Non-Reusable Sack'
  | 'Householder Provided Carrier Bag'
  | 'Wheeled Bin'
  | 'Trolibocs'
  | 'Trolibocs - Top box'
  | 'Trolibocs - Middle box'
  | 'Trolibocs - Bottom box'
  | 'Trolibocs – 3 containers';

export interface Container {
  name: ContainerName;
  displayName: string;
  bodyColour: string;
  lidColour?: string;
  interiorColour?: string;
  notes?: string[] | null;
  materials?: MaterialWithCategory[];
  cost?: number;
}

export enum PROPERTY_TYPE_EN {
  ALL = 'All properties',
  KERBSIDE = 'Kerbside properties',
  FLATS_WITH_COMMUNAL_BINS = 'Flats with communal bins',
  FLATS_WITH_INDIVIDUAL_BINS = 'Flats with individual bins or bags',
  NARROW_ACCESS = 'Narrow access/difficult to reach/remote properties',
}

export enum PROPERTY_TYPE_CY {
  ALL = 'Pob eiddo',
  KERBSIDE = 'Eiddo ymyl y ffordd',
  FLATS_WITH_COMMUNAL_BINS = 'Mynediad cul/anodd eu cyrraedd/eiddo anghysbell',
  FLATS_WITH_INDIVIDUAL_BINS = 'Fflatiau gyda biniau neu fagiau unigol',
  NARROW_ACCESS = 'Fflatiau gyda biniau cymunedol',
}

export interface LocalAuthorityProperty {
  name: string;
  type: 'Dry' | 'Food' | 'Garden';
  containers: Container[];
  notes?: string[];
}

export interface LocalAuthority {
  id: number;
  name: string;
  lastUpdate: string;
  enquiryNumber: string;
  recyclingUri: string;
  hwrcUri: string;
  gardenWasteUri: string;
  properties: { [key in PROPERTY_TYPE_EN]?: LocalAuthorityProperty[] };
}

export interface Location {
  id: string;
  address: string;
  distance: number;
  name: string;
  latitude: number;
  longitude: number;
  notes?: string;
  openingHours?: string;
  website?: string;
  collectionDetails?: string;
  telephone?: string;
  locations: {
    locationType: 'RECYCLE' | 'HWRC';
    source: 'valpak' | 'wrap';
    materials: MaterialWithCategory[];
  }[];
  error?: string;
}

export interface LocationsResponse {
  items: Location[];
  meta: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  pagination: {
    page: number;
    total: number;
  };
  error?: string;
}

export interface RecyclingMeta {
  id: number;
  category: 'HINT' | 'QUESTION';
  title: string;
  subtitle?: string;
  content?: string;
  materials?: number[];
  path?: string;
  image?: string;
  cta?: string;
  ctaLink?: string;
}
