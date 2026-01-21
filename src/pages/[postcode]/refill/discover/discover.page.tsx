import { useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';

import { useAppState } from '@/hooks/AppStateProvider';
import { usePostcode } from '@/hooks/PostcodeProvider';

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
  const { postcode } = usePostcode();

  return (
    <>
      <h2>{t('refill.discover.title')}</h2>
      <h3 className="text-size-base evg-text-weight-bold evg-spacing-bottom-none">
        {t('refill.discover.comingSoon')}
      </h3>
      <p>{t('refill.discover.subtitle')}</p>

      <locator-overflow>
        <ul>
          {pages.map((page) => (
            <li key={page}>
              <locator-card-link>
                <Link href={`/${postcode}/refill/discover/${page}`}>
                  <locator-card-link-img>
                    <img
                      src={`${publicPath}images/refill/${page}.webp`}
                      alt=""
                    />
                  </locator-card-link-img>
                  <locator-card-link-content>
                    <p className="evg-text-weight-bold evg-spacing-bottom-none">
                      {t(`refill.discover.nav.${page}.title`)}
                    </p>
                    <p>{t(`refill.discover.nav.${page}.description`)}</p>
                  </locator-card-link-content>
                </Link>
              </locator-card-link>
            </li>
          ))}
        </ul>
      </locator-overflow>

      <h3 className="text-size-base evg-text-weight-bold evg-spacing-top-lg">
        {t('refill.discover.reviews.title')}
      </h3>
      <locator-overflow largeScreen>
        <ul>
          {reviewers.map((reviewer) => (
            <li key={reviewer}>
              <evg-card className="theme-info" padding="sm">
                <evg-card-content>
                  <evg-row gap="sm">
                    <h4 className="evg-spacing-bottom-none">{reviewer}</h4>
                    <span
                      aria-label={t('refill.discover.reviews.rating', {
                        rating: 5,
                      })}
                    >
                      <locator-star-rating rating={5} aria-hidden />
                    </span>
                  </evg-row>
                  <p>{t(`refill.discover.reviews.testimonials.${reviewer}`)}</p>
                </evg-card-content>
              </evg-card>
            </li>
          ))}
        </ul>
      </locator-overflow>

      <locator-icon-link border className="evg-spacing-top-md">
        <Link href={`/${postcode}/refill/discover/sign-up`}>
          <locator-icon-circle>
            <locator-icon icon="home-pin" color="primary"></locator-icon>
          </locator-icon-circle>
          <div>
            <p className="text-size-base evg-spacing-bottom-none">
              {t('refill.discover.alerts.title')}
            </p>
            <p className="evg-text-size-body-xs">
              {t('refill.discover.alerts.description')}
            </p>
          </div>
        </Link>
      </locator-icon-link>
    </>
  );
}
