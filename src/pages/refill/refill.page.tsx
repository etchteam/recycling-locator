import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';

import { useAppState } from '@/lib/AppState';

import '@etchteam/diamond-ui/canvas/Section/Section';

import RefillLayout from './refill.layout';

export default function RefillPage() {
  const { t } = useTranslation();
  const { publicPath } = useAppState();

  const [searchParams] = useSearchParams();
  const postcode = searchParams.get('postcode');
  const postcodeQuery = postcode ? `?postcode=${postcode}` : '';

  return (
    <RefillLayout>
      <diamond-section padding="lg">
        <h2>{t('refill.start.title')}</h2>
        <h3 className="diamond-text-size-base diamond-text-weight-bold">
          {t('refill.start.comingSoon')}
        </h3>

        <locator-overflow style={{ '--anchor-name': '--funky' }}>
          <ul>
            {pages.map((page) => (
              <li key={page}>
                <locator-card-link>
                  <Link
                    to={'/refill/' + page + postcodeQuery}
                    unstable_viewTransition
                  >
                    <locator-card-link-img>
                      <img
                        src={`${publicPath}images/refill/${page}.webp`}
                        alt=""
                      />
                    </locator-card-link-img>
                    <locator-card-link-content>
                      <p className="diamond-text-weight-bold diamond-spacing-bottom-none">
                        {t(`refill.start.nav.${page}.title`)}
                      </p>
                      <p>{t(`refill.start.nav.${page}.description`)}</p>
                    </locator-card-link-content>
                  </Link>
                </locator-card-link>
              </li>
            ))}
          </ul>
        </locator-overflow>
      </diamond-section>
    </RefillLayout>
  );
}
