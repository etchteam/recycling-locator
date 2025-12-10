import { useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';

import useAnalytics from '@/hooks/useAnalytics';
import {
  DoorstepCollection as DoorstepCollectionType,
  Material,
} from '@/types/locatorApi';

export default function DoorstepCollection({
  collection,
  material,
  postcode,
}: {
  readonly collection: DoorstepCollectionType;
  readonly material: Material;
  readonly postcode: string;
}) {
  const { t } = useTranslation();
  const { recordEvent } = useAnalytics();

  const handleClick = () => {
    recordEvent({
      category: 'DoorstepCollections::Click',
      action: collection.provider,
    });
  };

  const bookingUrl = new URL(collection.bookingUrl);
  bookingUrl.searchParams.set('material', material.name);

  useEffect(() => {
    recordEvent({
      category: 'DoorstepCollections::Impression',
      action: `${collection.provider}, ${postcode}, ${material.name}`,
    });
  }, [collection, material, postcode, recordEvent]);

  return (
    <diamond-card border radius>
      <locator-icon-text className="diamond-spacing-bottom-xs">
        <locator-icon-circle variant={'positive'}>
          <locator-icon icon="doorstep-collection"></locator-icon>
        </locator-icon-circle>
        <h3>{t(`material.doorstepCollection.title`)}</h3>
      </locator-icon-text>
      <p className="diamond-text-size-sm">
        {t('material.doorstepCollection.intro')}
      </p>
      <diamond-button width="full-width">
        <Link
          href={bookingUrl.toString()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
        >
          {t(`material.doorstepCollection.cta`)}{' '}
          <locator-icon icon="external"></locator-icon>
        </Link>
      </diamond-button>
    </diamond-card>
  );
}
