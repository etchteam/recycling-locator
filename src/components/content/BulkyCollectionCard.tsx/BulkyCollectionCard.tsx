import { useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';

import { usePostcode } from '@/hooks/PostcodeProvider';
import { CustomElement } from '@/types/customElement';
import { LocalAuthority } from '@/types/locatorApi';

import './BulkyCollectionCard.css';

interface BulkyCollectionCardAttributes {
  noCollection?: boolean;
}

export default function BulkyCollectionCard({
  localAuthority,
}: {
  readonly localAuthority: LocalAuthority;
}) {
  const { postcode } = usePostcode();
  const { t } = useTranslation();
  const tContext = 'homeRecycling.bulkyCollection';
  const bulkyWaste = localAuthority.bulkyWaste ?? [];
  const hasCollection = bulkyWaste.length > 0;

  return (
    <evg-enter type="fade" className="evg-spacing-bottom-md">
      <locator-bulky-collection-card no-collection={!hasCollection}>
        <h4>{t(`${tContext}.title`)}</h4>
        {hasCollection ? (
          <>
            <p className="evg-spacing-bottom-sm evg-text-size-body-sm">
              {t(`${tContext}.description`)}
            </p>
            <evg-button width="full-width" size="sm">
              <Link href={`/${postcode}/home/bulky-collection`}>
                {t(`${tContext}.cta`)}
              </Link>
            </evg-button>
          </>
        ) : (
          <>
            <p className="evg-text-size-body-sm evg-spacing-bottom-sm">
              {t(`${tContext}.descriptionNoCollection`)}
            </p>
            <p className="evg-text-size-body-xs evg-text-weight-bold evg-spacing-bottom-sm">
              {t(`${tContext}.ctaNoCollection`)}
            </p>
            <evg-button width="full-width" size="sm">
              <a
                href={localAuthority.recyclingUri}
                target="_blank"
                rel="noopener noreferrer"
              >
                {localAuthority.name}
                <locator-icon icon="external"></locator-icon>
              </a>
            </evg-button>
          </>
        )}
      </locator-bulky-collection-card>
    </evg-enter>
  );
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-bulky-collection-card': CustomElement<BulkyCollectionCardAttributes>;
    }
  }
}
