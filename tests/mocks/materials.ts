import config from '@/config';
import { Material } from '@/types/locatorApi';

export const MATERIALS_ENDPOINT = `${config.locatorApiPath}materials?lang=en-GB`;
export const MATERIAL_ENDPOINT = `${config.locatorApiPath}materials/**`;
export const POPULAR_MATERIALS_ENDPOINT = `${config.locatorApiPath}materials?popular=true&lang=en-GB`;

export const ValidMaterialResponse: Material = {
  id: 43,
  name: 'Plastic milk bottles',
  popular: false,
};

export const EmptyMaterialsResponse = [];

export const PopularMaterialsResponse: Material[] = [
  {
    id: 45,
    name: 'Plastic pots, tubs and trays',
    popular: true,
  },
];
