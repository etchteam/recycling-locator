import { CustomElement } from '@/types/customElement';
import { RefillBrand } from '@/types/locatorApi';

import './RefillBrands.css';

interface RefillBrandsProps {
  readonly brands: RefillBrand[];
  readonly title?: string;
}

export default function RefillBrands({ brands, title }: RefillBrandsProps) {
  const brandsWithLogos = brands.filter((brand) => brand.logo);

  if (!brandsWithLogos.length) {
    return null;
  }

  return (
    <locator-refill-brands>
      <evg-card radius="sm">
        <evg-card-content>
          <div className="refill-brands-content">
            <h3>{title}</h3>
            <ul className="list-style-none refill-brands-list">
              {brandsWithLogos.map((brand) => (
                <li key={brand.id}>
                  <img src={brand.logo} alt={brand.name} loading="lazy" />
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
