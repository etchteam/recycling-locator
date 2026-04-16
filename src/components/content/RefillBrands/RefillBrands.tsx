import camelCase from 'lodash/camelCase';

import { useAppState } from '@/hooks/AppStateProvider';
import { CustomElement } from '@/types/customElement';

import './RefillBrands.css';

interface RefillBrandsProps {
  readonly companyNames: string[];
  readonly title?: string;
}

export default function RefillBrands({
  companyNames,
  title,
}: RefillBrandsProps) {
  const { publicPath } = useAppState();
  if (companyNames.length === 0) {
    return null;
  }

  return (
    <locator-refill-brands>
      <evg-card radius="sm">
        <evg-card-content>
          <div className="refill-brands-content">
            <h3>{title}</h3>
            <ul className="list-style-none refill-brands-list">
              {companyNames.map((name) => (
                <li key={name}>
                  <img
                    src={`${publicPath}images/refill/logos/${camelCase(name)}.webp`}
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
