import { useTranslation } from 'react-i18next';

import { CustomElement } from '@/types/customElement';

import './RefillBrands.css';

const BRAND_LOGO_MAP: Record<string, string> = {
  'Bio-D': 'bio-d.webp',
  Ecover: 'ecover.webp',
  'Faith in Nature': 'faith-in-nature.webp',
  'Marks and Spencer': 'marks-and-spencer.webp',
  SESI: 'sesi.webp',
  Suma: 'suma.webp',
};

interface RefillBrandsProps {
  readonly companyNames: string[];
}

export default function RefillBrands({ companyNames }: RefillBrandsProps) {
  const { t } = useTranslation();
  const brands = companyNames.filter((name) => name in BRAND_LOGO_MAP);

  if (brands.length === 0) {
    return null;
  }

  return (
    <locator-refill-brands>
      <evg-card radius="sm">
        <evg-card-content>
          <div className="refill-brands-content">
            <h3>{t('refill.brands.title')}</h3>
            <ul className="list-style-none refill-brands-list">
              {brands.map((name) => (
                <li key={name}>
                  <img
                    src={`/images/refill/logos/${BRAND_LOGO_MAP[name]}`}
                    alt={name}
                    loading="lazy"
                  />
                </li>
              ))}
            </ul>
          </div>
        </evg-card-content>
      </evg-card>
    </locator-refill-brands>
  );
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-refill-brands': CustomElement;
    }
  }
}
