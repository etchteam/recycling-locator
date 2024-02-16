import * as Sentry from '@sentry/browser';
import { useTranslation } from 'react-i18next';
import { Link, useRouteError } from 'react-router-dom';
import '@etchteam/diamond-ui/composition/FormGroup/FormGroup';
import '@etchteam/diamond-ui/control/Button/Button';
import '@etchteam/diamond-ui/canvas/Section/Section';

import '@/components/composition/Wrap/Wrap';
import '@/components/canvas/Tip/Tip';
import '@/components/control/LocationInput/LocationInput';
import StartLayout from '@/pages/layout';

import { IndexAside } from './index';

/**
 * Global app error boundary
 */
export default function ErrorPage() {
  const { t } = useTranslation();
  const error = useRouteError();
  Sentry.captureException(error, { tags: { route: 'Global error boundary' } });

  return (
    <StartLayout aside={<IndexAside />}>
      <locator-wrap>
        <diamond-section padding="lg">
          <h2>{t('start.error.title')}</h2>
          <p className="diamond-spacing-bottom-md">
            {t('start.error.message')}
          </p>
          <diamond-button width="full-width" variant="primary">
            <Link to="/">{t('start.error.cta')}</Link>
          </diamond-button>
        </diamond-section>
      </locator-wrap>
    </StartLayout>
  );
}
