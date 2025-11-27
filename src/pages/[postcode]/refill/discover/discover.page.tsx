import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';

import { useAppState } from '@/lib/AppState';

import '@etchteam/diamond-ui/canvas/Card/Card';
import '@etchteam/diamond-ui/composition/Grid/Grid';
import '@etchteam/diamond-ui/composition/Grid/GridItem';
import '@etchteam/diamond-ui/canvas/Section/Section';

import RefillLayout from './discover.layout';
const pages = ['guide', 'options', 'benefits'];
const reviewers = [
  'Fiona C',
  'Aidan W',
  'Hamish F',
  'Jen M',
  'Alex K',
  'Helen P',
];

export default function DiscoverRefillPage() {
  const { t } = useTranslation();
  const { publicPath } = useAppState();
  const { postcode } = useParams();

  return (
    <RefillLayout>
      <diamond-section padding="lg">
        <h2>{t('refill.discover.start.title')}</h2>
        <h3 className="diamond-text-size-base diamond-text-weight-bold diamond-spacing-bottom-none">
          {t('refill.discover.start.comingSoon')}
        </h3>
        <p>{t('refill.discover.start.subtitle')}</p>

        <locator-overflow>
          <ul>
            {pages.map((page) => (
              <li key={page}>
                <locator-card-link>
                  <Link
                    to={`/${postcode}/refill/discover/${page}`}
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

        <h3 className="diamond-text-size-base diamond-text-weight-bold diamond-spacing-top-lg">
          {t('refill.discover.start.reviews.title')}
        </h3>
        <locator-overflow largeScreen>
          <ul>
            {reviewers.map((reviewer) => (
              <li key={reviewer}>
                <diamond-card className="theme-info">
                  <diamond-grid align-items="center" gap="sm">
                    <diamond-grid-item>
                      <h4 className="diamond-spacing-bottom-none">
                        {reviewer}
                      </h4>
                    </diamond-grid-item>
                    <diamond-grid-item>
                      <span
                        aria-label={
                          t('refill.discover.start.reviews.rating', {
                            rating: 5,
                          }) as string
                        }
                      >
                        <locator-star-rating rating={5} aria-hidden />
                      </span>
                    </diamond-grid-item>
                  </diamond-grid>
                  <p>{t(`refill.start.reviews.testimonials.${reviewer}`)}</p>
                </diamond-card>
              </li>
            ))}
          </ul>
        </locator-overflow>

        <locator-icon-link border className="diamond-spacing-top-md">
          <Link
            to={`/${postcode}/refill/discover/sign-up`}
            unstable_viewTransition
          >
            <locator-icon-circle>
              <locator-icon icon="home-pin" color="primary"></locator-icon>
            </locator-icon-circle>
            <div>
              <p className="diamond-text-size-base diamond-spacing-bottom-none">
                {t('refill.discover.start.alerts.title')}
              </p>
              <p className="diamond-text-size-sm">
                {t('refill.discover.start.alerts.description')}
              </p>
            </div>
          </Link>
        </locator-icon-link>
      </diamond-section>
    </RefillLayout>
  );
}
