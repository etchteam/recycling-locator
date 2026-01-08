import { useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';

import { usePostcode } from '@/hooks/PostcodeProvider';
import useAnalytics from '@/hooks/useAnalytics';
import {
  DoorstepCollection as DoorstepCollectionType,
  Material,
} from '@/types/locatorApi';

export interface DoorstepCollectionProps {
  readonly collection: DoorstepCollectionType;
  readonly material: Material;
}

export default function DoorstepCollection({
  collection,
  material,
}: DoorstepCollectionProps) {
  const { t } = useTranslation();
  const { recordEvent } = useAnalytics();
  const { postcode } = usePostcode();

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
    <evg-card radius="sm">
      <evg-card-content>
        <locator-icon-text className="evg-spacing-bottom-xs">
          <locator-icon-circle variant={'positive'}>
            <locator-icon icon="doorstep-collection"></locator-icon>
          </locator-icon-circle>
          <h3>{t(`material.doorstepCollection.title`)}</h3>
        </locator-icon-text>
        <p className="evg-text-size-body-xs evg-spacing-bottom-sm">
          {t('material.doorstepCollection.intro')}
        </p>
        <evg-button width="full-width">
          <a
            href={bookingUrl.toString()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
          >
            {t(`material.doorstepCollection.cta`)}{' '}
            <locator-icon icon="external"></locator-icon>
          </a>
        </evg-button>
      </evg-card-content>
    </evg-card>
  );
}
