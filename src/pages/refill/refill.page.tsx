import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'wouter-preact';

import { useAppState } from '@/hooks/AppStateProvider';

const pages = ['guide', 'options', 'benefits'];
const reviewers = [
  'Fiona C',
  'Aidan W',
  'Hamish F',
  'Jen M',
  'Alex K',
  'Helen P',
];

export default function RefillPage() {
  const { t } = useTranslation();
  const { publicPath } = useAppState();

  const [searchParams] = useSearchParams();
  const postcode = searchParams.get('postcode');
  const postcodeQuery = postcode ? `?postcode=${postcode}` : '';

  return (
    <>
      <h2>{t('refill.start.title')}</h2>
      <h3 className="text-size-base evg-text-weight-bold evg-spacing-bottom-none">
        {t('refill.start.comingSoon')}
      </h3>
      <p>{t('refill.start.subtitle')}</p>

      <locator-overflow>
        <ul>
          {pages.map((page) => (
            <li key={page}>
              <locator-card-link>
                <Link href={'/refill/' + page + postcodeQuery}>
                  <locator-card-link-img>
                    <img
                      src={`${publicPath}images/refill/${page}.webp`}
                      alt=""
                    />
                  </locator-card-link-img>
                  <locator-card-link-content>
                    <p className="evg-text-weight-bold evg-spacing-bottom-none">
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

      <h3 className="text-size-base evg-text-weight-bold evg-spacing-top-lg">
        {t('refill.start.reviews.title')}
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
                      aria-label={t('refill.start.reviews.rating', {
                        rating: 5,
                      })}
                    >
                      <locator-star-rating rating={5} aria-hidden />
                    </span>
                  </evg-row>
                  <p>{t(`refill.start.reviews.testimonials.${reviewer}`)}</p>
                </evg-card-content>
              </evg-card>
            </li>
          ))}
        </ul>
      </locator-overflow>

      <locator-icon-link border className="evg-spacing-top-md">
        <Link href={'/refill/sign-up' + postcodeQuery}>
          <locator-icon-circle>
            <locator-icon icon="home-pin" color="primary"></locator-icon>
          </locator-icon-circle>
          <div>
            <p className="text-size-base evg-spacing-bottom-none">
              {t('refill.start.alerts.title')}
            </p>
            <p className="evg-text-size-body-xs">
              {t('refill.start.alerts.description')}
            </p>
          </div>
        </Link>
      </locator-icon-link>
    </>
  );
}
