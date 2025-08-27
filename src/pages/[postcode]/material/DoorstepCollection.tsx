import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import '@etchteam/diamond-ui/canvas/Card/Card';
import '@etchteam/diamond-ui/composition/Grid/Grid';
import '@etchteam/diamond-ui/composition/Grid/GridItem';
import '@etchteam/diamond-ui/control/Button/Button';

import '@/components/canvas/IconCircle/IconCircle';
import '@/components/composition/IconText/IconText';
import '@/components/composition/BorderedList/BorderedList';
import '@/components/control/IconLink/IconLink';
import '@/components/content/Icon/Icon';
import '@/components/content/Container/Container';

import { DoorstepCollection as DoorstepCollectionType } from '@/types/locatorApi';

export default function DoorstepCollection({
  collection,
}: {
  readonly collection: DoorstepCollectionType;
}) {
  const { t } = useTranslation();

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
        <Link to={collection.bookingUrl}>
          {t(`material.doorstepCollection.cta`)}{' '}
          <locator-icon icon="external"></locator-icon>
        </Link>
      </diamond-button>
    </diamond-card>
  );
}
