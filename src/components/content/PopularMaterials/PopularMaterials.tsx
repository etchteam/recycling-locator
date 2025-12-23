import { useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';

import { Material } from '@/types/locatorApi';

export interface PopularMaterialsProps {
  /**
   * The popular materials to list
   */
  readonly materials: Material[];
  /**
   * A function to generate the link to the view that users will be sent to when clicking on a material
   */
  readonly generatePath: (material: Material) => string;
}

export default function PopularMaterials({
  materials,
  generatePath,
}: PopularMaterialsProps) {
  const { t } = useTranslation();

  if (materials?.length === 0) {
    return null;
  }

  return (
    <diamond-enter type="fade-in-up">
      <locator-bordered-list size="sm" className="diamond-spacing-top-lg">
        <h3>{t('common.popularSearches')}</h3>
        <nav>
          <ul>
            {materials.map((material) => (
              <li key={material.id}>
                <Link href={generatePath(material)}>{material.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </locator-bordered-list>
    </diamond-enter>
  );
}
